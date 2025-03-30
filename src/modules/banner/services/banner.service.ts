import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateBannerDto } from '../dto/banner.dto';
import { FileUploadService } from 'src/modules/file-upload/services/file-upload.service';
import { getUserById } from 'src/utils/user.utils';
import { Role } from 'src/enums/role.enum';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class BannerService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly fileUploadService: FileUploadService,
    private jwtService: JwtService,
  ) {}

  async createBanner(
    body: CreateBannerDto,
    authHeader: string,
  ): Promise<{ message: string }> {
    try {
      const token = authHeader.split(' ')[1];
      const decoded: any = this.jwtService.decode(token);

      const userExists = await getUserById(this.entityManager, decoded.userId);

      if (!userExists || userExists?.user_role !== Role.ADMIN) {
        throw new UnauthorizedException('Access denied: Admins only');
      }

      await this.entityManager.query(
        `INSERT INTO "banner" (user_id , name , file_id, head_description, sub_description, btn_link, is_active) VALUES ($1 , $2 , $3 , $4 , $5 , $6, $7)`,
        [
          decoded.userId,
          body.name,
          body.file_id,
          body.head_description,
          body.sub_description,
          body.btn_link,
          true,
        ],
      );
      return { message: 'Banner Created successfully' };
    } catch (error) {
      throw error;
    }
  }

  async updateBanner(
    body: CreateBannerDto,
    authHeader: string,
  ): Promise<{ message: string }> {
    try {
      const token = authHeader.split(' ')[1];
      const decoded: any = this.jwtService.decode(token);

      const userExists = await getUserById(this.entityManager, decoded.userId);

      if (!userExists || userExists?.user_role !== Role.ADMIN) {
        throw new UnauthorizedException('Access denied: Admins only');
      }

      await this.entityManager.query(
        `UPDATE "banner" SET name = $1, file_id = $2, head_description = $3, sub_description = $4, btn_link = $5, is_active = $6`,
        [
          body.name,
          body.file_id,
          body.head_description,
          body.sub_description,
          body.btn_link,
          true,
        ],
      );
      return { message: 'Banner Created successfully' };
    } catch (error) {
      throw error;
    }
  }

  async getBannerAllBanner(
    status?: boolean,
  ): Promise<{ message: string | null; banners: any[] }> {
    try {
      let query = `SELECT * FROM "banner"`;
      const params: any[] = [];

      if (status !== undefined) {
        query += ` WHERE is_active = $1`;
        params.push(status);
      }
      const response = await this.entityManager.query(query, params);

      if (response?.length < 1) {
        return {
          message: 'No Banner',
          banners: [],
        };
      }

      const fileIds = [];
      response?.map((ele) => {
        fileIds.push(ele.file_id);
      });

      // Fetch file details if there are any file IDs
      const fileDataMap = fileIds.length
        ? await this.fileUploadService.getMultipleFileDetails(fileIds)
        : { file_details: [] };

      // Map file data back to response
      const banners = response.map((ele) => ({
        ...ele,
        file_info:
          fileDataMap.file_details.find(
            (file) => file.public_id === ele.file_id,
          ) || null,
      }));

      return {
        message: response.length === 0 ? 'No Banner' : null,
        banners: banners,
      };
    } catch (error) {
      console.error('Error fetching banners:', error);
      throw new Error('Failed to fetch banners');
    }
  }

  async deleteBannerByUserID(id: string): Promise<{ message: string }> {
    try {
      await this.entityManager.query(
        'UPDATE "banner" SET is_active = $2 WHERE id = $1',
        [id, false],
      );
      return { message: 'Banner Deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}
