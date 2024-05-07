import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { HelperDateService } from 'src/common/helpers/services/helper.date.service';
import { HelperEncryptionService } from 'src/common/helpers/services/helper.encryption.service';
import { HelperHashService } from 'src/common/helpers/services/helper.hash.service';
import { HelperStringService } from 'src/common/helpers/services/helper.string.service';

@Module({
    providers: [
        HelperEncryptionService,
        HelperHashService,
        HelperStringService,
        HelperDateService,
    ],
    exports: [
        HelperEncryptionService,
        HelperHashService,
        HelperStringService,
        HelperDateService,
    ],
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>(
                    'helper.jwt.defaultSecretKey'
                ),
                signOptions: {
                    expiresIn: configService.get<string>(
                        'helper.jwt.defaultExpirationTime'
                    ),
                },
            }),
        }),
    ],
})
export class HelpersModule {}
