import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './auth/user.schema';
import { Model } from 'mongoose';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  async getUsers() {
    return this.userModel.find({}, 'username email -_id').exec();
  }
}