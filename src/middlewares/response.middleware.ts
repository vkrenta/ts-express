import { RequestHandler } from 'express';

const responseMiddleware: (
  handler: (result: { code: number; body: any }) => any
) => RequestHandler = (handler) => (req, res, next) => {
  const send = res.send;
  let called = false;
  let result: { code: number; body: any } = { code: 200, body: null };
  res.send = function (body: any) {
    if (!called) {
      result.body = body;
      called = true;
    }

    return send.call(this, body);
  };

  let status = res.status;
  res.status = function (code) {
    result.code = code;
    return status.call(this, code);
  };
  let end = res.end;

  (<any>res.end) = function (
    chunk: any,
    encoding: BufferEncoding,
    cb?: (() => void) | undefined
  ) {
    result.code = res.statusCode;
    if (result.code === 404 && !called)
      result.body = `Cannot ${req.method} ${req.url}`;
    if (result.code === 500 && !called) result.body = `Internal server error`;
    handler(result);
    return end.call(res, chunk, encoding, cb);
  };

  next();
};

export default responseMiddleware;
