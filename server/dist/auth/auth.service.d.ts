import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';
import { SeedAdminDto } from './dto/seed-admin.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<UserDocument | null>;
    login(user: UserDocument): Promise<{
        access_token: string;
    }>;
    seedAdmin(dto: SeedAdminDto): Promise<{
        message: string;
    }>;
}
