import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserDoc } from 'src/modules/accounts/repository/entities/user.entity';
import { IEmailService } from 'src/modules/email/interfaces/email.interface';
import { EmailRepository } from 'src/modules/email/repositories/email.repository';
import { emailResetTemplate } from 'src/modules/email/templates/email.reset.template';
import { emailVerifyTemplate } from 'src/modules/email/templates/email.verify.template';

@Injectable()
export class EmailService implements IEmailService {
    private readonly appName: string;
    private readonly fromEmail: string;
    private readonly logger = new Logger(EmailService.name);

    constructor(
        private readonly emailRepository: EmailRepository,
        private readonly configService: ConfigService
    ) {
        this.appName = this.configService.get<string>('app.name');
        this.fromEmail = this.configService.get<string>('email.fromEmail');
        this.logger.debug('Config is loaded', {
            appName: this.appName,
            fromEmail: this.fromEmail,
        });
    }
    async sendVerification(user: UserDoc, token: string): Promise<boolean> {
        this.logger.log(`Send verify email to user ${user.email}`);
        const [res] = await this.emailRepository
            .send({
                to: user.email,
                from: this.fromEmail,
                subject: `Verify your ${this.appName} account`,
                html: emailVerifyTemplate(this.appName, user, token),
            })
            .catch((err) => {
                this.logger.error(err);
                throw new InternalServerErrorException({
                    statusCode: '500',
                    message: 'email.error.send',
                });
            });

        if (res.statusCode < 200 || res.statusCode >= 300) {
            return false;
        }
        return true;
    }
    async sendResetPassword(user: UserDoc, token: string): Promise<boolean> {
        const [res] = await this.emailRepository.send({
            to: user.email,
            from: this.fromEmail,
            subject: `Reset your ${this.appName} password`,
            html: emailResetTemplate(this.appName, user, token),
        });

        if (res.statusCode < 200 || res.statusCode >= 300) {
            return false;
        }
        return true;
    }
    async sendBan(user: UserDoc): Promise<boolean> {
        const [res] = await this.emailRepository.send({
            to: user.email,
            from: this.fromEmail,
            subject: `Your account has been banned`,
            html: `Your account has been banned`,
        });

        if (res.statusCode < 200 || res.statusCode >= 300) {
            return false;
        }
        return true;
    }
    async sendWarning(user: UserDoc): Promise<boolean> {
        const [res] = await this.emailRepository.send({
            to: user.email,
            from: this.fromEmail,
            subject: `Your account has been warned`,
            html: `Your account has been warned`,
        });
        if (res.statusCode < 200 || res.statusCode >= 300) {
            return false;
        }
        return true;
    }
}
