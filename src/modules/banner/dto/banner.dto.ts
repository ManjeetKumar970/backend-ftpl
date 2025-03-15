import {
  IsUUID,
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateBannerDto {
  @IsUUID('4', { message: 'user_id must be a valid UUID v4 format.' })
  @IsNotEmpty({ message: 'user_id is required.' })
  user_id: string;

  @IsString({ message: 'name must be a string.' })
  @MaxLength(255, { message: 'name must not exceed 255 characters.' })
  @IsNotEmpty({ message: 'name is required.' })
  name: string;

  @IsUrl({}, { message: 'image_link must be a valid URL.' })
  @MaxLength(500, { message: 'image_link must not exceed 500 characters.' })
  @IsNotEmpty({ message: 'image_link is required.' })
  image_link: string;

  @IsString({ message: 'head_description must be a string.' })
  @IsNotEmpty({ message: 'head_description is required.' })
  head_description: string;

  @IsString({ message: 'sub_description must be a string.' })
  @IsNotEmpty({ message: 'sub_description is required.' })
  sub_description: string;

  @IsUrl({}, { message: 'btn_link must be a valid URL.' })
  @MaxLength(500, { message: 'btn_link must not exceed 500 characters.' })
  @IsNotEmpty({ message: 'btn_link is required.' })
  btn_link: string;
}
