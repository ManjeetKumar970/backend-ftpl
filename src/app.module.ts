import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/auth/entities/user.entity';
import { OtpVerification } from './modules/auth/entities/otpVerification.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

// import Modules
import { AuthModule } from './modules/auth/module/auth.module';
import { BannerModule } from './modules/banner/module/banner.module';
import { ProductCategoryModule } from './modules/product-category/module/product-category.module';
import { FileUploadModule } from './modules/file-upload/module/file-upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false,
      },
      synchronize: true,
      autoLoadEntities: true,
      entities: [User, OtpVerification],
    }),
    AuthModule,
    BannerModule,
    ProductCategoryModule,
    FileUploadModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
