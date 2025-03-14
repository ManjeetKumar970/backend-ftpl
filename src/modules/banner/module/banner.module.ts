import { Module } from '@nestjs/common';
import { BannerService } from '../services/banner.services';
import { BannerResolver } from '../resolver/banner.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from '../entities/banner.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Banner])],
  providers: [BannerService, BannerResolver],
  exports: [BannerService],
})
export class BannerModule {}
