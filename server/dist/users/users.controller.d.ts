import { UsersService } from './users.service';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(payload: JwtPayload): Promise<{
        [x: string]: unknown;
    }>;
}
