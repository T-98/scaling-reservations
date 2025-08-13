import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../users/users.service';

@Injectable()
//export class LocalStrategy extends PassportStrategy(Strategy , 'local')
//local is set as the default strategy but we can override it with other strategies
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({ usernameField: 'email' });
  }
  async validate(email: string, password: string) {
    try {
      return await this.usersService.verifyUser(email, password);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
