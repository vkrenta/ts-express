import { Router } from 'express';

export abstract class ControllerType {
  public controllerRouter?: Router;
  public methodRouters?: Map<string, Router>;
  public preResponseHandler?: (result: any) => any;
}

export type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';
