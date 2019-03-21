import * as puppeteer from 'puppeteer';
import * as EventEmitter from 'events';
import { Source, isSourceUrl } from '.';

export default class Worker {
  page: puppeteer.Page;
  isIdle: boolean;
  emitter: EventEmitter;

  constructor(page: puppeteer.Page) {
    this.page = page;
    this.isIdle = true;
    this.emitter = new EventEmitter();
    this.waitForFinished = this.waitForFinished.bind(this);
  }

  async print(source: Source): Promise<Buffer> {
    this.isIdle = false;
    if (isSourceUrl(source)) {
      await this.page.goto(source.url);
    } else {
      await this.page.setContent(source.html);
    }
    const result = await this.page.screenshot({ type: 'jpeg' });
    this.isIdle = true;
    this.emitter.emit('finished');
    return result;
  }

  async waitForFinished(): Promise<Worker> {
    if (this.isIdle) return this;

    return new Promise<Worker>(resolve => {
      this.emitter.once('finish', () => resolve(this));
    });
  }
}
