import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { BannerService } from '../services/banner.service';
import { CreateBannerDto } from '../dto/banner.dto';
import { JwtAdminAuthGuard } from 'src/common/guard/jwt-admin-auth.guard';
import { JwtUserAuthGuard } from 'src/common/guard/jwt-user-auth.guard';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post('')
  @UseGuards(JwtAdminAuthGuard)
  async createBanner(
    @Body(new ValidationPipe({ whitelist: true })) body: CreateBannerDto,
  ) {
    return this.bannerService.createBanner(body);
  }

  @Get('/')
  @UseGuards(JwtUserAuthGuard)
  async getBannerByUserId(@Query('status') status?: boolean) {
    return this.bannerService.getBannerAllBanner(status);
  }

  @Delete(':id')
  @UseGuards(JwtAdminAuthGuard)
  async deleteBannerByUserID(@Param('id') id: string) {
    return this.bannerService.deleteBannerByUserID(id);
  }
}
