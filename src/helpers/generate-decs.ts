import { generateDecorators } from './controller-decorators';
import logger from './logger';

export const { Get, Patch, Post, Put, Controller, Delete } = generateDecorators(
  (result) => {
    logger.info({ label: 'Response', message: result });
  }
);
