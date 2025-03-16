import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { BannerService } from '../services/banner.service';
import { BannerController } from '../controller/banner.controller';
import { JwtAdminAuthGuard } from 'src/common/guard/jwt-admin-auth.guard';

@Module({
  imports: [JwtModule.register({})], // Ensure this is imported
  providers: [BannerService, JwtAdminAuthGuard],
  controllers: [BannerController],
})
export class BannerModule {}
