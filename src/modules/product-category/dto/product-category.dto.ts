import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProductCategoryDto {
  @IsString({ message: 'Product Category must be a string.' })
  @MaxLength(255, {
    message: 'Product Category must not exceed 255 characters.',
  })
  @IsNotEmpty({ message: 'Product Category is required.' })
  name: string;
}

export class UpdateProductCategoryDto extends CreateProductCategoryDto {}
