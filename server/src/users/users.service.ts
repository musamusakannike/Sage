import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from '../common/enums';

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
    const saved = await user.save();
    // Use the admin's own _id as their orgId (they are the org owner)
    await this.userModel.findByIdAndUpdate(saved._id, { orgId: saved._id });
    return { ...saved.toObject(), orgId: saved._id } as UserDocument;
  }

  async createInvited(
    name: string,
    email: string,
    role: UserRole,
    orgName: string,
    orgId: string,
  ): Promise<UserDocument> {
    const user = new this.userModel({ name, email, role, orgName, orgId });
    return user.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+passwordHash').lean().exec() as Promise<UserDocument | null>;
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).lean().exec() as Promise<UserDocument | null>;
  }

  async setOtp(userId: string, code: string, expiresAt: Date): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { otpCode: code, otpExpiresAt: expiresAt });
  }

  async clearOtp(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { $unset: { otpCode: '', otpExpiresAt: '' } });
  }

  async findByEmailWithOtp(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ email })
      .select('+otpCode +otpExpiresAt')
      .lean()
      .exec() as Promise<UserDocument | null>;
  }
}
