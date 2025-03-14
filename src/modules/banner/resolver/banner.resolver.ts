import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { BannerResponseDTO } from '../dto/banner-response.dto';
import { BannerService } from '../services/banner.services';
import { BannerCreateDTO } from '../dto/banner.dto';

@Resolver(() => BannerResponseDTO)
export class BannerResolver {
  constructor(private readonly bannerService: BannerService) {}

  @Query(() => String)
  healthCheck() {
    return 'GraphQL is working!';
  }

  @Mutation(() => BannerResponseDTO)
  async createBanner(
    @Args('input') input: BannerCreateDTO,
  ): Promise<BannerResponseDTO> {
    const response = await this.bannerService.createBanner(input);
    return response;
  }
}
