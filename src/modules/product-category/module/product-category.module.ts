import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProductCategoryService } from '../services/product-category.service';
import { ProductCategoryController } from '../controller/product-category.controller';

@Module({
  imports: [JwtModule.register({})],
  providers: [ProductCategoryService],
  controllers: [ProductCategoryController],
})
export class ProductCategoryModule {}
