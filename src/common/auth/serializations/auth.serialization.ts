import { ApiProperty, OmitType } from '@nestjs/swagger';

import { faker } from '@faker-js/faker';
import { Expose, Type } from 'class-transformer';

export class AuthAccessPayloadSerialization {
    @ApiProperty({
        required: true,
        nullable: false,
    })
    readonly user: Record<string, any>;

    @ApiProperty({
        required: true,
        nullable: false,
        example: faker.date.recent(),
    })
    @Expose()
    readonly loginDate: Date;

    @ApiProperty({
        required: true,
        nullable: false,
    })
    @Expose()
    readonly loginWith: string;

    @ApiProperty({
        required: true,
        nullable: false,
    })
    @Expose()
    readonly loginFrom: string;
}

export class AuthGooglePayloadDataSerialization {
    @ApiProperty({
        required: true,
        nullable: false,
    })
    email: string;
}

export class AuthGooglePayloadSerialization {
    @ApiProperty({
        required: true,
        nullable: false,
        type: AuthGooglePayloadDataSerialization,
    })
    @Type(() => AuthGooglePayloadDataSerialization)
    user: AuthGooglePayloadDataSerialization;
}
export class AuthRefreshPayloadSerialization extends OmitType(
    AuthAccessPayloadSerialization,
    ['user'] as const
) {
    @ApiProperty({
        required: true,
        nullable: false,
    })
    user: Record<string, any>;
}
