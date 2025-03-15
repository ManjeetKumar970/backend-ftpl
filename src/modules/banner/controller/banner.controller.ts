import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { BannerService } from '../services/banner.service';
import { CreateBannerDto } from '../dto/banner.dto';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post('')
  async createBanner(
    @Body(new ValidationPipe({ whitelist: true })) body: CreateBannerDto,
  ) {
    return this.bannerService.createBanner(body);
  }

  @Get('/')
  async getBannerByUserId() {
    return this.bannerService.getBannerByUserId();
  }

  @Delete(':id')
  async deleteBannerByUserID(@Param('id') id: string) {
    return this.bannerService.deleteBannerByUserID(id);
  }
}
