import {
  Controller,
  Post,
  Body,
  Query,
  Req,
  Get,
  Patch,
  Params,
  Status,
  Redirect,
} from '../../helpers/decorators';
import { ControllerType } from '../../helpers/types';

type Book = {
  author: string;
  year: Date;
  title: string;
};

@Controller('books')
class Books extends ControllerType {
  @Post('create')
  addBook(@Body body: Book, @Query query: any) {
    return { body, query };
  }

  @Get('all')
  getAllBooks(@Req req: Request) {
    const { url } = req;
    return { url };
  }

  @Patch(':id')
  updateBook(@Params params: any, @Body body: Book, @Status code: Function) {
    code(404);
    return {
      body,
      params,
      message: 'book updated',
    };
  }

  @Get('redirectable')
  redirectable(@Redirect redirect: Function) {
    redirect();
    return 'https://google.com';
  }
}

export default Books;
