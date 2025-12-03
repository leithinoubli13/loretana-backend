import { Module } from '@nestjs/common';
import { CustomizerController } from './customizer.controller';
import { CustomizerService } from './customizer.service';
import { ShopifyModule } from '../shopify/shopify.module';

@Module({
  imports: [ShopifyModule],
  controllers: [CustomizerController],
  providers: [CustomizerService],
  exports: [CustomizerService],
})
export class CustomizerModule {}
