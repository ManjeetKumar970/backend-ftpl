import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { BannerResponseWrapperDTO } from '../dto/banner-response.dto';
import { BannerService } from '../services/banner.services';
import { BannerCreateDTO } from '../dto/banner.dto';

@Resolver()
export class BannerResolver {
  constructor(private readonly bannerService: BannerService) {}

  @Query(() => String)
  healthCheck() {
    return 'GraphQL is working!';
  }

  @Mutation(() => BannerResponseWrapperDTO)
  async createBanner(
    @Args('input') input: BannerCreateDTO,
  ): Promise<BannerResponseWrapperDTO> {
    try {
      const response = await this.bannerService.createBanner(input);
      return {
        status: 'success',
        message: 'Banner created successfully',
        data: response,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }
}
