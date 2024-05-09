import { UserDoc } from 'src/modules/accounts/repository/entities/user.entity';

export interface IEmailService {
    sendVerification(user: UserDoc, token: string): Promise<boolean>;
    sendResetPassword(user: UserDoc, token: string): Promise<boolean>;
    sendBan(user: UserDoc): Promise<boolean>;
    sendWarning(user: UserDoc): Promise<boolean>;
}
