import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { FileUploadService } from '../services/file-upload.service';
import { FileUploadController } from '../controller/file-upload.controller';
import { JwtAdminAuthGuard } from 'src/common/guard/jwt-admin-auth.guard';
import { CloudinaryConfig } from 'src/config/cloudinary.config';

@Module({
  imports: [JwtModule.register({})],
  providers: [FileUploadService, JwtAdminAuthGuard, CloudinaryConfig],
  controllers: [FileUploadController],
  exports: [CloudinaryConfig],
})
export class FileUploadModule {}
