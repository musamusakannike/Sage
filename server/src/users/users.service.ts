import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

const SALT_ROUNDS = 12;

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto): Promise<UserDocument> {
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = new this.userModel({
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: dto.role,
      orgName: dto.orgName,
    });
    return user.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+passwordHash').lean().exec() as Promise<UserDocument | null>;
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).lean().exec() as Promise<UserDocument | null>;
  }
}
