import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'types/schemas/UserSchemas/user.schema';
import { hashPassword } from 'common/utils/hash.util';
import { UserDocument } from 'types/schemas/UserSchemas/user.mongoose.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}
  async create(data: User): Promise<User> {
    const hashed = await hashPassword(data.password);
    const createUser = await this.userModel.create({
      ...data,
      password: hashed,
    });
    return createUser.save();
  }
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  async findOne(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }
  async remove(id: string): Promise<any> {
    return this.userModel.deleteOne({ _id: id }).exec();
  }
  async removeALL(): Promise<any> {
    return this.userModel.deleteMany({}).exec();
  }
}
