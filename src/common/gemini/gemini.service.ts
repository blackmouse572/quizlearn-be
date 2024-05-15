import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiService {
    private readonly client: GoogleGenerativeAI;
    constructor(private readonly configService: ConfigService) {
        const key = this.configService.get<string>('gemini.apiKey');
        console.log('Start to config with key: ', key);

        this.client = new GoogleGenerativeAI(key);
    }

    async generateText(prompt: string): Promise<string> {
        const model = this.client.getGenerativeModel({
            model: 'gemini-pro',
            generationConfig: {},
        });

        const result = await model.generateContent(prompt);
        const response = result.response;
        return response.text();
    }
}
