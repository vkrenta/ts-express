import { RedirectType, SendFileType } from './../src/helpers/types';
import {
  Get,
  InitApp,
  Redirect,
  Res,
  SendFile,
} from './../src/helpers/decorators';
import { ApplicationType, Controller, ControllerType } from '../src';
import { json, Response, urlencoded } from 'express';
import { resolve } from 'path';

@Controller('test')
class BookController extends ControllerType {
  @Get('simple')
  simple() {
    return { test: 'test' };
  }

  @Get('responsable')
  responsable(@Res res: Response) {
    res.send({ message: 'must send this message withou errors' });
    return { another: 'this must be ignored' };
  }

  @Get('redirectable')
  redirectable(@Redirect rd: RedirectType) {
    rd('http://google.com');
    return { m: 'must be ignored' };
  }

  @Get('sendable')
  sendable(@SendFile sf: SendFileType) {
    sf(resolve(__dirname, 'doc.test.html'));
    return { m: 'must be ignored' };
  }

  @Get('promised')
  async promised() {
    const result = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ message: 'OK!' });
      }, 2000);
    });
    return result;
  }
}

@InitApp({
  before: [json(), urlencoded({ extended: true })],
  routes: { '/': [new BookController()] },
  after: [],
})
class App extends ApplicationType {}

new App(8000).listen(() => console.log('Listening port 8000'));
