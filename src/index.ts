import express, { json, urlencoded } from 'express';
import { ControllerType } from './helpers/types';
import { Controller, Get, Post } from './helpers/generate-decs';

@Controller()
class ProductController extends ControllerType {
  @Get('/')
  getAllProducts() {
    return { products: ['a', 'b', 'c'] };
  }
  @Get(':id/')
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
app.use((req, res, next) => {
  const oldSend = res.send;
  let consoled = false;
  res.send = function (body: any) {
    if (!consoled) {
      console.log(body);
      consoled = true;
    }
    return oldSend.call(this, body);
  };
  next();
});

app.use('/', pc.controllerRouter!);

app.use((req, res, next) => {
  console.log('404 content not found');
  res.status(404).send('content not found' + req.url);
});

app.listen(8000, () => console.log('running 800'));
