import { registerAs } from '@nestjs/config';

export default registerAs(
    'gemini',
    (): Record<string, any> => ({
        apiKey: process.env.GEMINI_API_KEY,
    })
);
