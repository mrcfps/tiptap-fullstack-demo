import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { data } from './db';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/docList')
  getDocList() {
    return Object.keys(data);
  }
}
