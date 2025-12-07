import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  ObjectId,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  get id(): string {
    return this._id ? this._id.toHexString() : '';
  }
  @Column({ unique: true })
  username: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  provider?: string; // 'local', 'google', 'github'

  @Column({ nullable: true })
  @Exclude()
  password: string;
  @Column({ nullable: true })
  picture?: string;
  @Column({ nullable: true })
  firstName?: string;
  @Column({ nullable: true })
  lastName?: string;
  @Column()
  isActive: boolean;
  @Column({ nullable: true })
  deactivatedAt?: Date;
  @CreateDateColumn()
  createAt: Date;
  @UpdateDateColumn()
  updateAt: Date;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  get fullName() {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
  }
}
