import puppeteer = require('puppeteer');
import shuffle = require('lodash.shuffle');
import { range } from '../utils/range';
import Worker from './worker';

let browser: puppeteer.Browser | null = null;
const workers: Worker[] = [];

interface Config {
  viewport: {
    width: number;
    height: number;
  };
}

export interface URLSource {
  url: string;
}

interface HtmlSource {
  html: string;
  url?: never;
}

export type Source = URLSource | HtmlSource;

export const init = async (pageLength: number, config: Config) => {
  if (browser != null) return;

  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  browser.on('disconnected', () => {
    process.exit(-1);
  });
  const pages = await Promise.all([...range(pageLength)].map(() => browser?.newPage()));
  pages.forEach((page) => {
    if (page == null) {
      return;
    }
    page.setViewport(config.viewport);
    workers.push(new Worker(page));
    page.on('error', () => {
      process.exit(-1);
    });
  });
};

const provideWorker = async (): Promise<Worker> => {
  const shuffledWorkers = shuffle(workers);
  const worker = await Promise.race(shuffledWorkers.map((w) => w.waitForFinished()));
  return worker;
};

export const publish = async (source: Source): Promise<Buffer> => {
  const worker = await provideWorker();
  const product = await worker.print(source);
  return product;
};
