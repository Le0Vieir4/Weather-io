import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  username: string;

  @Expose()
  picture?: string;

  @Expose()
  firstName?: string;

  @Expose()
  lastName?: string;

  @Expose()
  isActive: boolean;

  @Expose()
  createAt: Date;

  @Expose()
  updateAt: Date;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}

export class AuthResponseDto {
  @Expose()
  user: UserResponseDto;

  @Expose()
  access_token: string;
  // The constructor initializes the user and access_token properties.
  constructor(user: UserResponseDto, access_token: string) {
    this.user = user;
    this.access_token = access_token;
  }
}
