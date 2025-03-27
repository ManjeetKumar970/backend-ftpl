import { Injectable } from '@nestjs/common';
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
    const token = authHeader.split(' ')[1];
    const decoded: any = this.jwtService.decode(token);

    await this.entityManager.query(
      'INSERT INTO "category" (user_id , name, is_active) VALUES ($1 , $2)',
      [decoded?.userid, body?.name, true],
    );
    return { message: 'Product Category Created successfully' };
  }

  async deleteProductCategory(
    category_id: string,
  ): Promise<{ message: string }> {
    await this.entityManager.query(
      'UPDATE "category" SET is_active = $2 WHERE id = $1',
      [category_id, false],
    );
    return { message: 'Product Category Deleted successfully' };
  }

  async updateProductCategory(
    category_id: string,
    name: string,
  ): Promise<{ message: string }> {
    await this.entityManager.query(
      'UPDATE "category" SET name = $2 WHERE id = $1',
      [name, category_id],
    );
    return { message: 'Product Category update successfully' };
  }

  async getAllProductCategory(
    status?: boolean,
  ): Promise<{ message: string; category: any }> {
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
  }
}
