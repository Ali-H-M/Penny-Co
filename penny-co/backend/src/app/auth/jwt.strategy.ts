import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

interface JwtPayload {
  sub: string; // userId
  email: string;
  username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {

    super({
      // Extract the JWT from the request
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // Ensure expired tokens are rejected
      ignoreExpiration: false,

      // Secret key used to verify the tokens signature
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: JwtPayload) {

    // Find user in database using the ID from JWT payload (payload.sub)
    const user = await this.userModel.findById(payload.sub);

    if (!user) throw new UnauthorizedException();
    
    return {
      userId: user._id, // User MongoDB ID
      email: user.email,
      username: user.username,
    };
  }
}