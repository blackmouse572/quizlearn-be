import { DynamicModule, Module } from '@nestjs/common';
import { AuthJwtAccessStrategy } from 'src/common/auth/guards/jwt-access/jwt-access-token.strategy';
import { AuthJwtRefreshStrategy } from 'src/common/auth/guards/jwt-refresh/jwt-refresh-token.strategy';
import { AuthService } from 'src/common/auth/services/auth.service';
import { HelpersModule } from 'src/common/helpers/helpers.module';

@Module({
    providers: [AuthService, AuthJwtAccessStrategy, AuthJwtRefreshStrategy],
    exports: [AuthService],
    controllers: [],
    imports: [HelpersModule],
})
export class AuthModule {
    static forRoot(): DynamicModule {
        return {
            module: AuthModule,
            providers: [AuthJwtAccessStrategy, AuthJwtRefreshStrategy],
            exports: [],
            controllers: [],
            imports: [],
        };
    }
}
