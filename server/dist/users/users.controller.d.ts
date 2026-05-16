import { UsersService } from './users.service';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { UpdatePushTokenDto } from './dto/update-push-token.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(payload: JwtPayload): Promise<{
        [x: string]: unknown;
    }>;
    updatePushToken(payload: JwtPayload, dto: UpdatePushTokenDto): Promise<{
        message: string;
    }>;
}
