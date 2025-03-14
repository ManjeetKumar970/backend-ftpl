import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsString, IsUrl } from 'class-validator';

@InputType()
export class BannerCreateDTO {
  @Field()
  @IsUUID()
  user_id: string;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsUrl()
  image_link: string;

  @Field()
  @IsString()
  head_description: string;

  @Field()
  @IsString()
  sub_description: string;

  @Field()
  @IsUrl()
  btn_link: string;
}
