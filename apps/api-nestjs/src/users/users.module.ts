import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './users.controller';
import { UserMongooseSchema } from 'types/schemas/UserSchemas/user.mongoose.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserMongooseSchema, collection: 'users' },
    ]),
  ],
  controllers: [UserController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
