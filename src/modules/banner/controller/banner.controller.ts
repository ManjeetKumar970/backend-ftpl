import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { BannerService } from '../services/banner.service';
import { CreateBannerDto, UpdateBannerDto } from '../dto/banner.dto';
import { JwtAdminAuthGuard } from 'src/common/guard/jwt-admin-auth.guard';
import { JwtCommonAuthGuard } from 'src/common/guard/jwt-common-auth.guard';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post('')
  @UseGuards(JwtAdminAuthGuard)
  async createBanner(
    @Body(new ValidationPipe({ whitelist: true })) body: CreateBannerDto,
    @Headers('authorization') authHeader: string,
  ) {
    return this.bannerService.createBanner(body, authHeader);
  }

  @Patch(':id')
  @UseGuards(JwtAdminAuthGuard)
  async updateBanner(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true })) body: UpdateBannerDto,
  ) {
    return this.bannerService.updateBanner(id, body);
  }

  @Get('')
  @UseGuards(JwtCommonAuthGuard)
  async getBanner(@Query('status') status?: boolean) {
    return this.bannerService.getBannerAllBanner(status);
  }

  @Get('/:id')
  @UseGuards(JwtCommonAuthGuard)
  async getBannerByUserId(@Param('id') id: string) {
    return this.bannerService.getBannerById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAdminAuthGuard)
  async deleteBanner(@Param('id') id: string) {
    return this.bannerService.deleteBanner(id);
  }
}
