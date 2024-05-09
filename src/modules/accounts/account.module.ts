import { Module } from '@nestjs/common';
import { AuthService } from 'src/common/auth/services/auth.service';
import { HelpersModule } from 'src/common/helpers/helpers.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { UserAdminController } from 'src/modules/accounts/controllers/user.admin.controller';
import { UserAuthController } from 'src/modules/accounts/controllers/user.auth.controller';
import { UserPersonalController } from 'src/modules/accounts/controllers/user.personal.controller';
import { UserPublicController } from 'src/modules/accounts/controllers/user.public.controller';
import { UserRepositoryModule } from 'src/modules/accounts/repository/user.repository.module';
import { UserService } from 'src/modules/accounts/services/account.service';
import { EmailModule } from 'src/modules/email/email.module';

@Module({
    providers: [AuthService, UserService],
    exports: [AuthService, UserService],
    controllers: [
        UserPersonalController,
        UserAuthController,
        UserPublicController,
        UserAdminController,
    ],
    imports: [
        UserRepositoryModule,
        HelpersModule,
        PaginationModule,
        EmailModule,
    ],
})
export class AccountModule {}
