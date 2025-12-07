import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto, UserResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { CurrentUser } from './decorator/current-user.decorator';
import { User } from '../users/user.entity';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { GoogleGuard } from './guard/google-auth.guard';
import { OauthUserDto } from './dto/oAuth.dto';
import { GithubGuard } from './guard/github-auth.guard';

interface RequestWithUser extends Request {
  user: OauthUserDto;
}

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: User): UserResponseDto {
    return new UserResponseDto(user);
  }

  // Initiates the Google OAuth flow
  @Get('google')
  @UseGuards(GoogleGuard)
  googleLogin() {}

  // Callback route for Google OAuth
  @Get('google/callback')
  @UseGuards(GoogleGuard)
  googleCallback(@Req() req: RequestWithUser, @Res() res: Response): void {
    try {
      const user = req.user;
      const token = this.authService.loginWithOauth(user);
      const frontendUrl = process.env.FRONTEND_URL;
      res.redirect(`${frontendUrl}/auth/google/callback?token=${token}`);
    } catch (error) {
      if (error) {
        const frontendUrl = process.env.FRONTEND_URL;
        res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
      }
    }
  }

  // Initiates the GitHub OAuth flow
  @Get('github')
  @UseGuards(GithubGuard)
  githubLogin() {}

  // Callback route for GitHub OAuth
  @Get('github/callback')
  @UseGuards(GithubGuard)
  githubCallback(@Req() req: RequestWithUser, @Res() res: Response): void {
    try {
      const user = req.user;
      const token = this.authService.loginWithOauth(user);
      const frontendUrl = process.env.FRONTEND_URL;
      res.redirect(`${frontendUrl}/auth/github/callback?token=${token}`);
    } catch (error) {
      if (error) {
        const frontendUrl = process.env.FRONTEND_URL;
        res.redirect(`${frontendUrl}/login?error=github_auth_failed`);
      }
    }
  }
}
