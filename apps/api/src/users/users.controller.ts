import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { UserResponseDto } from 'src/auth/dto/auth-response.dto';
import { UpdateUserDto } from '../auth/dto/update-user.dto';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';
import { CleanupService } from './cleanup.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cleanupService: CleanupService,
  ) {}

  @Post()
  async createUser(@Body() registerDto: RegisterDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(registerDto);
    return new UserResponseDto(user);
  }

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserResponseDto(user));
  }
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findById(id);
    return new UserResponseDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/password')
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.changePassword(
      id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
    return new UserResponseDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<UpdateUserDto>,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.update(id, updateUserDto);
    return new UserResponseDto(user);
  }

  @Delete(':id')
  async deactivate(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.deactivate(id);
    return new UserResponseDto(user);
  }

  // Manually executes cleanup of inactive users
  // Permanently removes users deactivated for more than X days

  @Post('cleanup/inactive')
  async cleanupInactiveUsers(): Promise<{ deleted: number; message: string }> {
    const deletedCount = await this.cleanupService.runCleanupManually();
    return {
      deleted: deletedCount,
      message: `${deletedCount} inactive user(s) permanently deleted`,
    };
  }

  // Immediately deletes ALL inactive users (use with caution!)
  @Delete('cleanup/all-inactive')
  async deleteAllInactive(): Promise<{ deleted: number; message: string }> {
    const deletedCount = await this.usersService.deleteAllInactive();
    return {
      deleted: deletedCount,
      message: `${deletedCount} inactive user(s) deleted`,
    };
  }
}
