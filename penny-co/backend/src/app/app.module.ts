import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // used for .env
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // used to load .env
    MongooseModule.forRoot(process.env.MONGO_URI), // Connection to MongoDB
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
