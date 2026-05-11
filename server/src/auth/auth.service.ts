import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';
import { SeedAdminDto } from './dto/seed-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return null;

    return user;
  }

  async login(user: UserDocument): Promise<{ access_token: string }> {
    const payload = {
      sub: String(user._id),
      email: user.email,
      role: user.role,
      orgId: user.orgId?.toString() ?? '',
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  async seedAdmin(dto: SeedAdminDto): Promise<{ message: string }> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new UnauthorizedException('Email already registered.');
    }
    await this.usersService.create(dto);
    return { message: 'Admin created.' };
  }
}
