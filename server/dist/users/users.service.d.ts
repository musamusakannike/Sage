import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from '../common/enums';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(dto: CreateUserDto): Promise<UserDocument>;
    createInvited(name: string, email: string, role: UserRole, orgName: string, orgId: string): Promise<UserDocument>;
    findByEmail(email: string): Promise<UserDocument | null>;
    findById(id: string): Promise<UserDocument | null>;
    setOtp(userId: string, code: string, expiresAt: Date): Promise<void>;
    clearOtp(userId: string): Promise<void>;
    findByEmailWithOtp(email: string): Promise<UserDocument | null>;
    updatePushToken(userId: string, expoPushToken: string): Promise<void>;
}
