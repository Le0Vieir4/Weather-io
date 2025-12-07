import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { UpdateUserDto } from '../auth/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // find user methods
  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      where: { isActive: true },
      select: [
        '_id',
        'email',
        'username',
        'firstName',
        'lastName',
        'picture',
        'createAt',
        'updateAt',
      ],
    });
  }

  private isValidObjectId(id: string): boolean {
    // Check if id is a valid 24 character hex string (MongoDB ObjectId format)
    return /^[0-9a-fA-F]{24}$/.test(id);
  }

  async findById(id: string): Promise<User> {
    if (!this.isValidObjectId(id)) {
      throw new NotFoundException('Invalid user ID format');
    }

    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(id), isActive: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email, isActive: true } });
  }

  async findByEmailAndProvider(
    email: string,
    provider: string,
  ): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email, provider, isActive: true },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username, isActive: true } });
  }

  async create(user: Partial<User>): Promise<User> {
    // if OAuth, check email + provider
    if (user.provider) {
      const alreadyExistOAuth = await this.findByEmailAndProvider(
        String(user.email),
        user.provider,
      );
      if (alreadyExistOAuth) {
        throw new ConflictException(
          `This email is already in use with ${user.provider}`,
        );
      }
    } else {
      // If local registration, check only email
      const alreadyExistEmail = await this.findByEmail(String(user.email));
      if (alreadyExistEmail)
        throw new ConflictException('This email is already in use');
    }

    const alreadyExistUsername = await this.findByUsername(
      String(user.username),
    );

    if (alreadyExistUsername)
      throw new ConflictException('This username is already in use');

    const newUser = this.userRepository.create({
      ...user,
      isActive: true,
      provider: user.provider || 'local', // Define 'local' if not provided
    });
    return this.userRepository.save(newUser);
  }

  async update(id: string, newUserData: Partial<UpdateUserDto>): Promise<User> {
    const user = await this.findById(id);

    // Remove password - use changePassword method instead
    delete newUserData.password;

    // Validate email if being changed
    if (newUserData.email && newUserData.email !== user.email) {
      const emailExists = await this.findByEmail(newUserData.email);
      if (emailExists) {
        throw new ConflictException('This email is already in use');
      }
    }

    // Validate username if being changed
    if (newUserData.username && newUserData.username !== user.username) {
      const usernameExists = await this.findByUsername(newUserData.username);
      if (usernameExists) {
        throw new ConflictException('This username is already in use');
      }
    }

    Object.assign(user, newUserData);

    return this.userRepository.save(user);
  }

  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(id), isActive: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValidPassword = await user.validatePassword(currentPassword);
    if (!isValidPassword) {
      throw new ConflictException('Current password is incorrect');
    }

    // Update password - manually hash since @BeforeInsert only runs on insert
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);

    return this.userRepository.save(user);
  }

  async deactivate(id: string): Promise<User> {
    const user = await this.findById(id);
    user.isActive = false;
    user.deactivatedAt = new Date();
    return this.userRepository.save(user);
  }

  // Permanently deletes users who have been inactive for more than X days
  // Default is 30 days
  async deleteInactiveUsers(daysInactive: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysInactive);

    const usersToDelete = await this.userRepository.find({
      where: {
        isActive: false,
      },
    });

    const expiredUsers = usersToDelete.filter(
      (user) => user.deactivatedAt && user.deactivatedAt < cutoffDate,
    );

    if (expiredUsers.length === 0) {
      return 0;
    }

    await this.userRepository.remove(expiredUsers);

    return expiredUsers.length;
  }

  // Immediately deletes all inactive users (use with caution!)
  async deleteAllInactive(): Promise<number> {
    const users = await this.userRepository.find({
      where: { isActive: false },
    });

    if (users.length === 0) {
      return 0;
    }

    await this.userRepository.remove(users);

    return users.length;
  }

  // validate users method
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email, isActive: true },
    });
    if (user && (await user.validatePassword(password))) {
      return user;
    }
    return null;
  }
}
