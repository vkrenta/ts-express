import { Router, RequestHandler } from 'express';
import { Method, ControllerType } from './types';
import logger from './logger';

const trimSlash = (str: string) => '/' + str.replace(/^\/+|\/+$/g, '');

function methodFucntion(method: Method) {
  return function (path: string = '') {
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
        try {
          const result = (<any>target)[functionName]();
          res.send(result);
        } catch (error) {
          next(error);
        }
      };
      router[method](path, handler);
    };
  };
}

export const Get = methodFucntion('get');
export const Post = methodFucntion('post');
export const Put = methodFucntion('put');
export const Patch = methodFucntion('patch');
export const Delete = methodFucntion('delete');

export function Controller(path: string = '') {
  return function (constructor: Function) {
    const target = <ControllerType>constructor.prototype;
    path = trimSlash(path);
    target.controllerRouter = Router();
    target.methodRouters?.forEach((router) => {
      target.controllerRouter?.use(path, router);
    });
  };
}
