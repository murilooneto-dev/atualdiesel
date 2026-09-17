import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { Public } from './common/decorators/public.decorator.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHealth(): string {
    console.log('[DIAG] AppController.getHealth: handler executing');
    const result = this.appService.getHealth();
    console.log('[DIAG] AppController.getHealth: returning', result);
    return result;
  }
}
