import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Banner {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => ID)
  @Column('uuid', { nullable: false })
  user_id: string;

  @Field(() => String)
  @Column({ nullable: false })
  name: string;

  @Field(() => String)
  @Column({ nullable: false })
  image_link: string;

  @Field(() => String)
  @Column({ nullable: false })
  head_description: string;

  @Field(() => String)
  @Column({ nullable: false })
  sub_description: string;

  @Field(() => String)
  @Column({ nullable: false })
  btn_link: string;

  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
