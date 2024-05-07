import { registerAs } from '@nestjs/config';

export default registerAs(
    'sendgrid',
    (): Record<string, any> => ({
        key: process.env.SEND_GRID_KEY,
    })
);
