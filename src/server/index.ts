import express = require('express');
import * as factory from '../pictureFactory';

export interface Query {
  text: string;
}

export const isQueryPerfect = (queryPartial: Partial<Query>): queryPartial is Query => queryPartial.text != null;

export const extractQuery = (query: Partial<Query>): Query | null => {
  if (!isQueryPerfect(query)) {
    return null;
  }
  try {
    return {
      text: decodeURIComponent(query.text)
    };
  } catch (e) {
    return null;
  }
};

export const run = (port: number, assetsServerUrl: string) => {
  const app = express();

  app.get('/', async (req, res) => {
    const query = extractQuery(req.query);
    if (query == null) {
      res.status(400).send('bad request');
      return;
    }
    const textEncoded = encodeURIComponent(query.text);
    const url = `${assetsServerUrl}?text=${textEncoded}`;
    const picture = await factory.publish({ url });
    res.type('png').send(picture);
  });

  app.listen(port, () => console.log(`🌟 app server is listening on port ${port}`));
};
