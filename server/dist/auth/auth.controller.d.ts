import { AuthService } from './auth.service';
import { SeedAdminDto } from './dto/seed-admin.dto';
import { InviteDto } from './dto/invite.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import type { UserDocument } from '../users/schemas/user.schema';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: {
        user: UserDocument;
    }): Promise<{
        access_token: string;
    }>;
    seedAdmin(dto: SeedAdminDto): Promise<{
        message: string;
    }>;
    invite(dto: InviteDto, caller: JwtPayload): Promise<{
        message: string;
    }>;
    requestOtp(dto: RequestOtpDto): Promise<{
        message: string;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        access_token: string;
    }>;
}
