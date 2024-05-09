import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/common/auth/services/auth.service';
import { HelperHashService } from 'src/common/helpers/services/helper.hash.service';
import { ENUM_USER_SIGN_UP_FROM } from 'src/modules/accounts/constants/user.constant';
import { UserSignUpDto } from 'src/modules/accounts/dtos/user-signup.dto';
import { UserDoc } from 'src/modules/accounts/repository/entities/user.entity';
import { UserService } from 'src/modules/accounts/services/account.service';
import { EmailService } from 'src/modules/email/services/email.service';

@ApiTags('modules.public.user')
@Controller({
    version: '1',
    path: '/auth',
})
export class UserPublicController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly hashService: HelperHashService,
        private readonly emailService: EmailService
    ) {}

    @Post('/sign-up')
    async signUp(
        @Body()
        { email, ...body }: UserSignUpDto
    ): Promise<void> {
        const emailExist = await this.userService.existByEmail(email);

        if (emailExist) {
            const user = await this.userService.findOneByEmail<UserDoc>(email);
            const isVerified = await this.userService.isVerified(user);
            if (!isVerified) {
                this.emailService.sendVerification(
                    user,
                    user.verificationToken
                );
                throw new ConflictException({
                    statusCode: '400',
                    message: 'user.error.emailExist',
                });
            }
        }

        const password = await this.authService.createPassword(body.password);

        const user: UserDoc = await this.userService.create(
            {
                email,
                signUpFrom: ENUM_USER_SIGN_UP_FROM.PUBLIC,
                role: 'user',
                useAICount: 10,
                ...body,
            },
            password
        );
        const token = this.hashService.ramdomToken(6);
        await this.userService.updateVerifyToken(user, token);
        await this.emailService.sendVerification(user, token);

        return;
    }
}
