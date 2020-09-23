import express, { Router, RequestHandler, ErrorRequestHandler } from 'express';
import { createServer } from 'http';
import {
  Method,
  ControllerType,
  trimSlash,
  ApplicationDecoratorType,
  ApplicationType,
  Field,
} from './types';

function methodFucntion(method: Method) {
  return function (
    path: string = '',
    ...middlewares: (RequestHandler | ErrorRequestHandler)[]
  ) {
    return function (
      target: ControllerType,
      functionName: string,
      descriptor: PropertyDescriptor
    ) {
      if (!target.methodRouters) {
        target.methodRouters = new Map();
      }
      if (!target.methodRouters.get(functionName)) {
        target.methodRouters.set(functionName, Router());
      }

      path = trimSlash(path);
      const router = target.methodRouters.get(functionName)!;

      const handler: RequestHandler = (req, res, next) => {
        let statusCode: number = 200;
        let sendMethod: any;
        const args = target.parametersMap?.[functionName].map((field) => {
          switch (field) {
            case 'req':
              return req;
            case 'status':
              return (code: number) => {
                statusCode = code;
              };
            case 'redirect':
              return (url: any, code?: any) => {
                sendMethod = res.redirect.bind(res, code ? code : 302, url);
              };
            case 'file':
              return (path: string, options: any, fn: any) => {
                if (options) {
                  if (fn) {
                    sendMethod = res.sendFile.bind(res, path, options, fn);
                  } else {
                    sendMethod = res.sendFile.bind(res, path, options);
                  }
                } else sendMethod = res.sendFile.bind(res, path);
              };
            case 'res':
              return res;
            default:
              return req[field];
          }
        });
        try {
          const result = args
            ? (<any>target)[functionName](...args)
            : (<any>target)[functionName]();
          res.status(statusCode);
          if (sendMethod) return sendMethod();
          res.send(result);
        } catch (error) {
          next(error);
        }
      };

      router[method](path, ...middlewares, handler);
    };
  };
}

export const Get = methodFucntion('get');
export const Post = methodFucntion('post');
export const Put = methodFucntion('put');
export const Patch = methodFucntion('patch');
export const Delete = methodFucntion('delete');
export const Head = methodFucntion('head');
export const Connect = methodFucntion('connect');
export const Options = methodFucntion('options');
export const Trace = methodFucntion('trace');

export function Controller(path: string = '') {
  return function (
    constructor: Function,
    ...middlewares: (RequestHandler | ErrorRequestHandler)[]
  ) {
    const target = <ControllerType>constructor.prototype;
    path = trimSlash(path);
    target.controllerRouter = Router();
    target.methodRouters?.forEach((router) => {
      target.controllerRouter?.use(path, ...middlewares, router);
    });
  };
}

export function InitApp({ before, routes, after }: ApplicationDecoratorType) {
  return function (constructor: Function) {
    const target: ApplicationType = constructor.prototype;
    if (!target.app) target.app = express();
    if (!target.server) target.server = createServer(target.app);
    if (!target.rootRouter) target.rootRouter = Router();
    before.forEach((middleware) => {
      target.app?.use(middleware);
    });
    Object.keys(routes).forEach((path) => {
      routes[path].forEach((controller) => {
        target.rootRouter?.use(trimSlash(path), controller.controllerRouter!);
      });
    });
    after.forEach((middleware) => {
      target.app?.use(middleware);
    });
    target.app?.use('/', target.rootRouter!);
  };
}

function parametersFunction(field: Field) {
  return (target: ControllerType, methodName: string, index: number) => {
    if (!target.parametersMap) target.parametersMap = {};
    if (!target.parametersMap[methodName])
      target.parametersMap[methodName] = [];
    target.parametersMap[methodName][index] = field;
  };
}

export const Body = parametersFunction('body');
export const Query = parametersFunction('query');
export const Params = parametersFunction('params');
export const Cookies = parametersFunction('cookies');
export const SignedCookies = parametersFunction('signedCookies');
export const Req = parametersFunction('req');
export const Status = parametersFunction('status');
export const Redirect = parametersFunction('redirect');
export const SendFile = parametersFunction('file');
export const Res = parametersFunction('res');
