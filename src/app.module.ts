import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AuthModule } from './modules/auth/modules/auth.module';
import { AuthController } from './modules/auth/controller/auth.controller';
import { User } from './modules/auth/entities/user.entity';
import { OtpVerification } from './modules/auth/entities/otpVerification.entity';
import { ScheduleModule } from '@nestjs/schedule';

// Load ConfigModule first
ConfigModule.forRoot({ isGlobal: true });

console.log('Database Configuration:');
console.log('Host:', process.env.DB_HOST);
console.log('Port:', process.env.DB_PORT);
console.log('Username:', process.env.DB_USER);
console.log('Password:', process.env.DB_PASS);
console.log('Database:', process.env.DB_NAME);

@Module({
  imports: [
    ScheduleModule.forRoot(),
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
