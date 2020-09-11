import express, { json, urlencoded } from 'express';
import { Controller, Get, Post } from './helpers/controller-decorators';
import logger from './helpers/logger';
import { ControllerType } from './helpers/types';
import responseMiddleware from './middlewares/response.middleware';

@Controller()
class ProductController extends ControllerType {
  @Get('/')
  getAllProducts() {
    return { products: ['a', 'b', 'c'] };
  }
  @Get(':id')
  getProduct() {
    return { product: 'a' };
  }
  @Post('//')
  addProduct() {}

  preResponseHandler = (arg: any) => {
    console.log(arg);
  };
}

const pc = new ProductController();
const app = express();
app.get('/favicon.ico', (_, __, next) => next());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(
  responseMiddleware(({ code, body }) => {
    logger.log({ label: `Response][Code ${code}`, message: body });
  })
);

app.use('/', pc.controllerRouter!);

app.use((req, res, next) => {
  res.status(404).send(`{ message: 'content not found ' + req.url }`);
});

app.listen(8000, () => console.log('running 800'));
