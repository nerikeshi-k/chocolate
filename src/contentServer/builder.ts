import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';
import * as dotenv from 'dotenv';

dotenv.config();

const WIDTH = Number(process.env.WIDTH);
const HEIGHT = Number(process.env.HEIGHT);

const templatesDir = path.join(process.cwd(), 'templates');
const templateFileName = 'main.ejs';

let templateMemorized: string | null = null;
const getTemplate = (): string => {
  // developmentモード時は毎回htmlを読みに行く
  if (templateMemorized != null && process.env.NODE_ENV !== 'development') {
    return templateMemorized;
  }
  templateMemorized = fs.readFileSync(path.join(templatesDir, templateFileName)).toString();
  return templateMemorized;
};

export const build = (text: string): string => {
  return ejs.render(getTemplate(), { text, width: WIDTH, height: HEIGHT });
};
