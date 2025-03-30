import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Get,
  Param,
  Body,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { Multer } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from '../services/file-upload.service';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 15))
  async fileUpload(@UploadedFiles() files: Multer.File) {
    return this.fileUploadService.uploadFiles(files);
  }

  @Get('/:public_id')
  async getFileDetails(@Param('public_id') public_id: string) {
    return this.fileUploadService.getFileDetails(public_id);
  }

  @Delete('/:public_id')
  async deleteFileDetails(@Param('public_id') public_id: string) {
    return this.fileUploadService.deleteFileDetails(public_id);
  }

  @Post('/all')
  async getMultipleFileDetails(
    @Body(new ValidationPipe({ whitelist: true })) ids: any,
  ) {
    return this.fileUploadService.getMultipleFileDetails(ids?.public_ids);
  }
}
