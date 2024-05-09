import { registerAs } from '@nestjs/config';

export default registerAs(
    'email',
    (): Record<string, any> => ({
        fromEmail: process.env.EMAIL_FROM_EMAIL,
        fromName: process.env.EMAIL_FROM_NAME,
        fromUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    })
);
