import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async signup(userData: { username: string; email: string; password: string }) {
    const { username, email, password } = userData;

    if (!username || !email || !password) {
      throw new BadRequestException('Missing fileds')
    }

    // Dont allaw Dublicated username
    const existingUsername = await this.userModel.findOne({ username });
    if (existingUsername) {
      throw new ConflictException('Username alrady exist')
    }

    // Dont allaw Dublicated emails
    const existingEmail = await this.userModel.findOne({ email });
    if (existingEmail) {
      throw new ConflictException('email alrady exist')
    }

    // Encryp user password to save in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = new this.userModel({
      username,
      email,
      password: hashedPassword,
    });

    
    try {
      await createdUser.save();
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error);
    }

    return {
      message: 'New user has been registered successfully',
      user: { username, email },
    };
  }
}
