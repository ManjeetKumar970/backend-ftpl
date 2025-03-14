import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { BannerCreateDTO } from '../dto/banner.dto';
import { BannerResponseDTO } from '../dto/banner-response.dto';

@Injectable()
export class BannerService {
  constructor(private entityManager: EntityManager) {}

  async createBanner(body: BannerCreateDTO): Promise<BannerResponseDTO> {
    if (!body.user_id) {
      throw new HttpException('user_id is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const response = await this.entityManager.query(
        `INSERT INTO "banner" 
    ("user_id", "name", "image_link", "head_description", "sub_description", "btn_link") 
    VALUES ($1, $2, $3, $4, $5, $6) 
    RETURNING *;`,
        [
          body.user_id,
          body.name,
          body.image_link,
          body.head_description,
          body.sub_description,
          body.btn_link,
        ],
      );

      if (!response || response.length === 0 || !response[0]) {
        throw new Error('Database did not return a valid object.');
      }

      return response[0];
    } catch (error) {
      console.error('Error creating banner:', error);
      throw new HttpException(
        'Failed to create banner. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
