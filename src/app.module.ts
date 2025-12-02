import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QrModule } from './qr/qr.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [QrModule, EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
