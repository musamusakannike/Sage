import { UserRole } from '../../common/enums';
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    orgName: string;
    role: UserRole;
}
