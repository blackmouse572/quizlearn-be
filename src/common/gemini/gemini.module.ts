import { Module } from '@nestjs/common';
import { GeminiService } from 'src/common/gemini/gemini.service';

@Module({
    providers: [GeminiService],
    exports: [GeminiService],
})
export class GeminiModule {}
