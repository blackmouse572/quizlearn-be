import { Module } from '@nestjs/common';
import { GeminiModule } from 'src/common/gemini/gemini.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { AccountModule } from 'src/modules/accounts/account.module';
import { QuizController } from 'src/modules/quizbank/controller/quiz.controller';
import { QuizbankAdminController } from 'src/modules/quizbank/controller/quizbank.admin.controller';
import { QuizbankController } from 'src/modules/quizbank/controller/quizbank.controller';
import { QuizbankRepositoryModule } from 'src/modules/quizbank/repository/quizbank-repository.module';
import { QuizService } from 'src/modules/quizbank/services/quiz.service';
import { QuizbankService } from 'src/modules/quizbank/services/quizbank.service';

@Module({
    providers: [QuizService, QuizbankService],
    exports: [QuizService, QuizbankService],
    imports: [
        QuizbankRepositoryModule,
        AccountModule,
        PaginationModule,
        GeminiModule,
    ],
    controllers: [QuizController, QuizbankController, QuizbankAdminController],
})
export class QuizbankModule {}
