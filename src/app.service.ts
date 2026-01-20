import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  checkHealth() {
    const response = {
      message: 'Hello sonu I am alive!',
    };
    return response;
  }
}
