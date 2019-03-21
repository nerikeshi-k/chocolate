import * as express from 'express';
import * as path from 'path';
import { extractQuery } from '../server';
import { build } from './builder';

const assetsDir = path.join(process.cwd(), 'templates', 'assets');

export const run = (port: number) => {
  const app = express();
  app.use('/assets', express.static(assetsDir));

  app.get('/', async (req, res) => {
    const query = extractQuery(req.query);
    if (query == null) {
      res.status(400).send('bad request');
      return;
    }
    const content = build(query.text);
    res.send(content);
  });

  app.listen(port, () => console.log(`🌟 content server is listening on port ${port}`));
};
