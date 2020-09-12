import { RequestHandler } from 'express';

type resultType = {
  method?: string;
  headers?: any;
  url?: string;
  body?: any;
  cookies?: any;
  signedCookies?: any;
};
type handlerType = (result: resultType) => any;
type middlewareType = (handler: handlerType) => RequestHandler;

const requestMiddleware: middlewareType = (handler) => (req, res, next) => {
  const { method, headers, url, body, cookies, signedCookies } = req;
  handler({ method, headers, url, body, cookies, signedCookies });
  next();
};

export default requestMiddleware;
