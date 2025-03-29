import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { BannerService } from '../services/banner.service';
import { BannerController } from '../controller/banner.controller';
import { JwtAdminAuthGuard } from 'src/common/guard/jwt-admin-auth.guard';
import { CloudinaryConfig } from 'src/config/cloudinary.config';
import { FileUploadService } from 'src/modules/file-upload/services/file-upload.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [
    FileUploadService,
    BannerService,
    JwtAdminAuthGuard,
    CloudinaryConfig,
  ],
  controllers: [BannerController],
})
export class BannerModule {}
