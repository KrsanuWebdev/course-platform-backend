import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('App Module')
@Controller('/')
export class AppController {
  constructor(private readonly _appService: AppService) {}

  @ApiOperation({
    summary: 'Check application health status',
  })
  @Get('health')
  checkHealth() {
    return this._appService.checkHealth();
  }
}
