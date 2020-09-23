import { RequestHandler } from 'express';

const requestMiddleware: (
  handler: (result: {
    method?: string;
    headers?: any;
    url?: string;
    body?: any;
    cookies?: any;
    signedCookies?: any;
  }) => any
) => RequestHandler = (handler) => (req, res, next) => {
  const { method, headers, url, body, cookies, signedCookies } = req;
  handler({ method, headers, url, body, cookies, signedCookies });
  next();
};

export default requestMiddleware;
