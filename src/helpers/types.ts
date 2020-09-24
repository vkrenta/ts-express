import {
  Application,
  ErrorRequestHandler,
  RequestHandler,
  Router,
} from 'express';
import { Server } from 'http';

export abstract class ControllerType {
  public controllerRouter?: Router;
  public methodRouters?: Map<string, Router>;
  public preResponseHandler?: (result: any) => any;
  public parametersMap?: {
    [key: string]: Field[];
  };
}

export type Method =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'
  | 'head'
  | 'connect'
  | 'options'
  | 'trace';

export const trimSlash = (str: string) => '/' + str.replace(/^\/+|\/+$/g, '');

export type ApplicationDecoratorType = {
  before: (RequestHandler | ErrorRequestHandler)[];
  routes: {
    [path: string]: ControllerType[];
  };
  after: (RequestHandler | ErrorRequestHandler)[];
};

export abstract class ApplicationType {
  public rootRouter?: Router;
  public app?: Application;
  public server?: Server;
  public get port() {
    return this._port;
  }
  constructor(private _port: number) {}
  public listen(callback?: any) {
    if (!this.app || !this.server)
      throw new Error('Application must be initiated');
    this.server?.listen(this._port, callback);
  }
}

export type Field =
  | 'body'
  | 'query'
  | 'params'
  | 'cookies'
  | 'signedCookies'
  | 'req'
  | 'status'
  | 'redirect'
  | 'file'
  | 'res';
