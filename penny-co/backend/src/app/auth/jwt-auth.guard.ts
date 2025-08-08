import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  // Determine if a route can be accessed
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // Custome Error handling
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new Error('Unauthorized');
    }
    return user;
  }
}