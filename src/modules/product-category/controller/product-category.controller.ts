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
  ValidationPipe,
} from '@nestjs/common';
import { ProductCategoryService } from '../services/product-category.service';
import {
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
} from '../dto/product-category.dto';

@Controller('product-category')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Post()
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
  async getAllProductCategory(@Query('status') status?: boolean) {
    return await this.productCategoryService.getAllProductCategory(status);
  }
}
