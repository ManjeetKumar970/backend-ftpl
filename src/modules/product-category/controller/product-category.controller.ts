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
import { ProductCategoryService } from '../services/product-category.service';
import {
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
} from '../dto/product-category.dto';
import { JwtAdminAuthGuard } from 'src/common/guard/jwt-admin-auth.guard';

@Controller('product-category')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Post()
  @UseGuards(JwtAdminAuthGuard)
  async createNewProductCategory(
    @Body(new ValidationPipe({ whitelist: true }))
    body: CreateProductCategoryDto,
    @Headers('authorization') authHeader: string,
  ) {
    return await this.productCategoryService.createNewProductCategoryServices(
      body,
      authHeader,
    );
  }

  @Delete('/:id')
  async deleteProductCategory(@Param('id') id: string) {
    return await this.productCategoryService.deleteProductCategory(id);
  }

  @Patch('/:id')
  @UseGuards(JwtAdminAuthGuard)
  async deleteUpdateCategory(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true }))
    body: UpdateProductCategoryDto,
  ) {
    return await this.productCategoryService.updateProductCategory(
      id,
      body?.name,
    );
  }

  @Get('')
  @UseGuards(JwtAdminAuthGuard)
  async getAllProductCategory(@Query('is_active') status?: boolean) {
    return await this.productCategoryService.getAllProductCategory(status);
  }

  @Get(':id')
  @UseGuards(JwtAdminAuthGuard)
  async getSingleProductCategory(@Param('id') id: string) {
    return await this.productCategoryService.getSingleProductCategory(id);
  }
}
