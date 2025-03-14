import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class BannerResponseDTO {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field(() => String, { nullable: true })
  user_id: string;

  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  image_link: string;

  @Field(() => String, { nullable: true })
  head_description: string;

  @Field(() => String, { nullable: true })
  sub_description: string;

  @Field(() => String, { nullable: true })
  btn_link: string;
}
