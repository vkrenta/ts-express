import { Router, RequestHandler } from 'express';
import { Method, ControllerType } from './types';
import logger from './logger';

const trimSlash = (str: string) => '/' + str.replace(/^\/+|\/+$/g, '');

export function generateDecorators(
  resultHandler: (result: any) => any = () => {}
) {
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

  const Get = methodFucntion('get');
  const Post = methodFucntion('post');
  const Put = methodFucntion('put');
  const Patch = methodFucntion('patch');
  const Delete = methodFucntion('delete');

  function Controller(path: string = '') {
    return function (constructor: Function) {
      const target = <ControllerType>constructor.prototype;
      path = trimSlash(path);
      target.controllerRouter = Router();
      target.methodRouters?.forEach((router) => {
        target.controllerRouter?.use(path, router);
      });
    };
  }

  return { Get, Post, Put, Patch, Delete, Controller };
}
