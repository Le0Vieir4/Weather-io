import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import type { JwtPayload } from '../dto/jwt-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    const secret = process.env.SECRET;

    if (!secret) {
      throw new Error(
        'SECRET environment variable is not defined in JwtStrategy',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    // if user is OAuth, return the payload data (do not search in the database)
    if (payload.isOAuth) {
      console.log('🔐 JWT validado para usuário OAuth:', {
        provider: payload.provider,
        email: payload.email,
      });
      return {
        id: payload.sub,
        email: payload.email,
        username: payload.username || '',
        firstName: payload.firstName || '',
        lastName: payload.lastName || '',
        picture: payload.picture,
        provider: payload.provider,
        isOAuth: true,
      };
    }

    // if user is not OAuth, validate normally against the database
    const user = await this.authService.validateUserById(String(payload.sub));
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }
}
