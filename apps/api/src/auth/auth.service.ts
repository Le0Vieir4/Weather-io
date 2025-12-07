import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthResponseDto, UserResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { OauthUserDto } from './dto/oAuth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    try {
      const user = await this.usersService.create(registerDto);
      const payload = { sub: user.id, email: user.email };
      const access_token = this.jwtService.sign(payload);

      const userResponse = new UserResponseDto(user);
      return new AuthResponseDto(userResponse, access_token);
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new ConflictException('Registration failed');
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    // validate user credentials
    const user = await this.usersService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const userId = user._id?.toHexString();
    // generate JWT token
    const payload = { sub: userId, email: user.email };
    const access_token = this.jwtService.sign(payload);

    // return user response
    const userResponse = new UserResponseDto({ ...user, id: userId });
    return new AuthResponseDto(userResponse, access_token);
  }

  async validateUserById(userId: string): Promise<User | null> {
    try {
      return await this.usersService.findById(userId);
    } catch {
      return null;
    }
  }

  generateAuthResponse(user: User): AuthResponseDto {
    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);
    const userResponse = new UserResponseDto(user);
    return new AuthResponseDto(userResponse, access_token);
  }

  loginWithOauth(profile: OauthUserDto): string {
    // Don't create or fetch user from DB, just generate JWT
    const payload = {
      sub: `${profile.provider}-${profile.email}`, // Unique ID based on provider + email
      email: profile.email,
      username: profile.username,
      provider: profile.provider,
      picture: profile.picture,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      isOAuth: true, // Flag to identify as OAuth user
    };

    const token = this.jwtService.sign(payload);
    return token;
  }
}
