import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserSchema } from 'types/schemas/UserSchemas/user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() body: unknown) {
    const parsed = UserSchema.parse(body);
    return this.usersService.create(parsed);
  }
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Delete(':_id')
  remove(@Param('_id') id: string) {
    return this.usersService.remove(id);
  }

  @Delete()
  removeAll() {
    return this.usersService.removeALL();
  }
}
