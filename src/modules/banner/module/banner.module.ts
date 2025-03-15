import { Module } from '@nestjs/common';
import { BannerService } from '../services/banner.service';
import { BannerController } from '../controller/banner.controller';

@Module({
  controllers: [BannerController],
  providers: [BannerService],
  exports: [BannerService],
})
export class BannerModule {}
