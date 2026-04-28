import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { message: string, documentation: string } {
    return {
      message: "API du projet d'AP - Les Fripouilles",
      documentation: "/api/doc"
    };
  }
}
