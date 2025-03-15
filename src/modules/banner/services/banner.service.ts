import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateBannerDto } from '../dto/banner.dto';
import { getUserById } from 'src/utils/user.utils';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class BannerService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async createBanner(body: CreateBannerDto): Promise<{ message: string }> {
    const userExists = await getUserById(this.entityManager, body.user_id);

    if (!userExists || userExists?.user_role !== Role.ADMIN) {
      throw new UnauthorizedException(
        'Access denied: Only administrators are authorized to perform this action.',
      );
    }

    await this.entityManager.query(
      `INSERT INTO "banner" (user_id , name , image_link, head_description, sub_description, btn_link, is_active) VALUES ($1 , $2 , $3 , $4 , $5 , $6, $7)`,
      [
        body.user_id,
        body.name,
        body.image_link,
        body.head_description,
        body.sub_description,
        body.btn_link,
        true,
      ],
    );
    return { message: 'Banner Created successfully' };
  }

  async getBannerByUserId(): Promise<{ message: string | null; banners: any }> {
    const response = await this.entityManager.query(`SELECT * FROM "banner"`);
    const message = response.length === 0 ? 'No Banner' : null;
    return { message: message, banners: response };
  }

  async deleteBannerByUserID(id: string): Promise<{ message: string }> {
    await this.entityManager.query(
      'UPDATE "banner" SET is_active = $2 WHERE id = $1',
      [id, false],
    );
    return { message: 'Banner Deleted successfully' };
  }
}
