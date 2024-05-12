import {
    IDatabaseFindAllOptions,
    IDatabaseSaveOptions,
    IDatabaseSoftDeleteManyOptions,
} from 'src/common/database/interfaces/database.interface';
import { QuizCreateDto } from 'src/modules/quizbank/dtos/quiz-create.dto';
import {
    QuizDoc,
    QuizEntity,
} from 'src/modules/quizbank/repository/entities/quiz.entity';
import { QuizbankEntity } from 'src/modules/quizbank/repository/entities/quizbank.entity';

export interface IQuizService {
    createQuizzes(
        quizzes: QuizCreateDto[],
        options?: IDatabaseSaveOptions
    ): Promise<boolean>;
    getQuizzes(options?: IDatabaseFindAllOptions): Promise<QuizDoc[]>;
    getQuizzesByQuizbankId(
        quizbankId: string,
        options?: IDatabaseFindAllOptions
    ): Promise<QuizDoc[]>;
    deleteQuizzesByQuizbankId(
        quizbankId: string,
        options?: IDatabaseSoftDeleteManyOptions
    ): Promise<boolean>;
    updateAIExplanation(
        explanation: string,
        repository: QuizDoc,
        options?: IDatabaseSaveOptions
    ): Promise<QuizDoc>;
    populateQuiz(repository: QuizDoc): Promise<IQuizEntity>;
    getTotal(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<number>;
}

export interface IQuizEntity extends Omit<QuizEntity, 'quizbank'> {
    quizbank: QuizbankEntity;
}
