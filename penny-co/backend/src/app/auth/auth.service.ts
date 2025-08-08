// auth/auth.service.ts - Complete version
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  // Signup =>
  async signup(userData: { username: string; email: string; password: string }) {
    const { username, email, password } = userData;
    if (!username || !email || !password) {
      throw new BadRequestException('Missing fields');
    }
    
    // Dont allow duplicated username
    const existingUsername = await this.userModel.findOne({ username });
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }
    
    // Dont allow duplicated emails
    const existingEmail = await this.userModel.findOne({ email });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }
    
    // Encrypt user password to save in the database
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

  // Signin JWT token =>
   async signin(body: { email: string; password: string }) {
    
    const user = await this.userModel.findOne({ email: body.email });

    if (!user || !await bcrypt.compare(body.password, user.password)) {
      throw new BadRequestException('Invalid email or password');
    }

    const token = this.jwtService.sign({ 
      sub: user._id, 
      email: user.email,
      username: user.username 
    });

    return {
      access_token: token,
      user: { id: user._id, email: user.email, username: user.username },
      expires_in: 8 * 60 * 60, // 8 hours
    };
  }

  // Token validation method
  async validateToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userModel.findById(decoded.sub);

      if (!user) throw new UnauthorizedException('User not found');
      return { userId: user._id, email: user.email, username: user.username };
      
    } catch (error) {
      throw new UnauthorizedException('Invalid token. Error: ', error);
    }
  }
}