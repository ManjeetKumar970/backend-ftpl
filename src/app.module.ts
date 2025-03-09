import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AuthModule } from './modules/auth/modules/auth.module';
import { AuthController } from './modules/auth/controller/auth.controller';
import { User } from './modules/auth/entities/user.entity';
import { OtpVerification } from './modules/auth/entities/otpVerification.entity';

// Load ConfigModule first
ConfigModule.forRoot({ isGlobal: true });

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
  ],
  controllers: [],
  providers: [
    AuthController,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
