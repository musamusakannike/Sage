import { AuthService } from './auth.service';
import { SeedAdminDto } from './dto/seed-admin.dto';
import { UserDocument } from '../users/schemas/user.schema';
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
}
