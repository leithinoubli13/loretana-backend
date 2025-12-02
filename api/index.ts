import { NestFactory } from '@nestjs/core';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { AppModule } from '../src/app.module';

let app: any;

export default async (req: VercelRequest, res: VercelResponse) => {
  if (!app) {
    app = await NestFactory.create(AppModule);
    await app.init();
  }

  // Use NestJS HTTP adapter to handle the request
  return app.getHttpAdapter().getInstance()(req, res);
};
