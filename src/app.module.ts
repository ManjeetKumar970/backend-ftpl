import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load env variables globally
    MongooseModule.forRoot(process.env.MONGO_URI), // Connect to MongoDB
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
