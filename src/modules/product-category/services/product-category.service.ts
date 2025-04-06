import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateProductCategoryDto } from '../dto/product-category.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private jwtService: JwtService,
  ) {}

  async createNewProductCategoryServices(
    body: CreateProductCategoryDto,
    authHeader: string,
  ): Promise<{ message: string }> {
    try {
      const token = authHeader.split(' ')[1];
      const decoded: any = this.jwtService.decode(token);

      await this.entityManager.query(
        'INSERT INTO "category" (user_id , name, is_active) VALUES ($1 , $2, $3)',
        [decoded?.userId, body?.name, true],
      );
      return { message: 'Product Category Created successfully' };
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException(
          'Category name already exists. Please choose a different name.',
          HttpStatus.CONFLICT,
        );
      }
      throw error;
    }
  }

  async deleteProductCategory(
    category_id: string,
  ): Promise<{ message: string }> {
    try {
      const [category] = await this.entityManager.query(
        'SELECT id FROM "category" where id = $1',
        [category_id],
      );

      if (!category?.id) {
        throw new HttpException(
          'Category not found. Invalid category ID.',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.entityManager.query(
        'UPDATE "category" SET is_active = $2 WHERE id = $1',
        [category_id, false],
      );
      return { message: 'Product Category Deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async updateProductCategory(
    category_id: string,
    name: string,
  ): Promise<{ message: string }> {
    try {
      const [category] = await this.entityManager.query(
        'SELECT id FROM "category" where id = $1',
        [category_id],
      );

      if (!category?.id) {
        throw new HttpException(
          'Category not found. Invalid category ID.',
          HttpStatus.NOT_FOUND,
        );
      }

      const [existingCategory] = await this.entityManager.query(
        'SELECT id FROM "category" WHERE name = $1',
        [name],
      );

      if (existingCategory?.id) {
        throw new HttpException(
          'Category name already exists. Please choose a different name.',
          HttpStatus.CONFLICT,
        );
      }

      await this.entityManager.query(
        'UPDATE "category" SET name = $2 WHERE id = $1',
        [category_id, name],
      );
      return { message: 'Product Category update successfully' };
    } catch (error) {
      throw error;
    }
  }

  async getAllProductCategory(
    status?: boolean,
  ): Promise<{ message: string; category: any }> {
    try {
      let query = `SELECT * FROM "category"`;
      const params: any[] = [];

      if (status !== undefined) {
        query += ` WHERE is_active = $1`;
        params.push(status);
      }

      const response = await this.entityManager.query(query, params);

      return {
        message: response.length === 0 ? 'No category' : null,
        category: response,
      };
    } catch (error) {
      throw error;
    }
  }

  async getSingleProductCategory(
    id: string,
  ): Promise<{ id: string; name: string }> {
    try {
      const [response] = await this.entityManager.query(
        'SELECT * FROM "category" WHERE id = $1 AND is_active = true',
        [id],
      );

      if (!response) {
        throw new NotFoundException('No active Category found');
      }

      return {
        id: response?.id,
        name: response?.name,
      };
    } catch (error) {
      throw error;
    }
  }
}
