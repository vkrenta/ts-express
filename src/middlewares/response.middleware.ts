import { RequestHandler } from 'express';

type resultType = { code: number; body: any };
type handlerType = (result: resultType) => any;
type middlewareType = (handler: handlerType) => RequestHandler;
type endType = {
  (cb?: (() => void) | undefined): void;
  (chunk: any, cb?: (() => void) | undefined): void;
  (chunk: any, encoding: BufferEncoding, cb?: (() => void) | undefined): void;
};

const responseMiddleware: middlewareType = (handler) => (req, res, next) => {
  const send = res.send;
  let called = false;
  let result: resultType = { code: 200, body: null };
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
    handler(result);
    return end.call(res, chunk, encoding, cb);
  };

  next();
};

export default responseMiddleware;