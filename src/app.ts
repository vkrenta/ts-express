import { json, Router, urlencoded } from 'express';
import Books from './controllers/books/books.controller';
import { InitApp } from './helpers/decorators';
import logger from './helpers/logger';
import { ApplicationType } from './helpers/types';
import requestMiddleware from './middlewares/request.middleware';
import responseMiddleware from './middlewares/response.middleware';

@InitApp({
  before: [
    Router().get('/favicon.ico', (_, __, next) => {
      next();
    }),
    json(),
    urlencoded({ extended: true }),
    requestMiddleware(({ method, url, body }) =>
      logger.log({ label: 'Request', message: { method, url, body } })
    ),
    responseMiddleware(({ code, body }) => {
      logger.log({ label: `Response][Code ${code}`, message: body });
    }),
  ],
  routes: {
    '/': [new Books()],
  },
  after: [],
})
class App extends ApplicationType {}

export default App;
