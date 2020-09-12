import { Application, ErrorRequestHandler, RequestHandler, Router } from 'express';
import { Server } from 'http';

export abstract class ControllerType {
  public controllerRouter?: Router;
  public methodRouters?: Map<string, Router>;
  public preResponseHandler?: (result: any) => any;
}

export type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

export const trimSlash = (str: string) => '/' + str.replace(/^\/+|\/+$/g, '');

export type ApplicationDecoratorType = {
  before: (RequestHandler | ErrorRequestHandler)[];
  routes: {
    [path: string]: ControllerType[];
  };
  after: (RequestHandler | ErrorRequestHandler)[];
};

export type listenHandler = ({ port, error }: { port?: number; error?: any }) => any;

export abstract class ApplicationType {
  public rootRouter?: Router;
  public app?: Application;
  public server?: Server;
  constructor(private port: number) {}
  public listen(handler?: listenHandler) {
    return new Promise((resolve, reject) => {
      if (this.app) resolve(this.port);
      else reject('Application must be inited');
    })
      .then((v) => {
        this.server?.listen(<number>v, () => {
          handler?.call(handler, { port: <number>v });
        });
      })
      .catch((error) => handler?.call(handler, { error }));
  }
}
