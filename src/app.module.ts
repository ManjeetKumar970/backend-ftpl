import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

// Auth Module
import { AuthModule } from './auth/modules/auth.module';
import { AuthController } from './auth/controller/auth.controller';
import { AuthService } from './auth/services/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load env variables globally
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
