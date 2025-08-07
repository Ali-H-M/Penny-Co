import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async signup(userData: any) {
    const { username, email, password } = userData;

    if (!username || !email || !password) {
      return { message: 'Missing fields', success: false };
    }

    // Dont allaw Dublicated username
    const existingUsername = await this.userModel.findOne({ username });
    if (existingUsername) {
      return { message: 'username already exists', success: false };
    }

    // Dont allaw Dublicated emails
    const existingEmail = await this.userModel.findOne({ email });
    if (existingEmail) {
      return { message: 'Email already exists', success: false };
    }

    // Encryp user password to save in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = new this.userModel({
      username,
      email,
      password: hashedPassword,
    });

    await createdUser.save();

    return {
      message: 'User registered successfully',
      success: true,
      user: { username, email },
    };
  }
}
