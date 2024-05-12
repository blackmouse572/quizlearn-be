import { Injectable } from '@nestjs/common';
import {
    IDatabaseFindAllOptions,
    IDatabaseSaveOptions,
} from 'src/common/database/interfaces/database.interface';
import {
    IQuizEntity,
    IQuizService,
} from 'src/modules/quizbank/intefaces/quiz.service.interface';
import { QuizDoc } from 'src/modules/quizbank/repository/entities/quiz.entity';
import { QuizRepository } from 'src/modules/quizbank/repository/repositories/quiz.repository';

@Injectable()
export class QuizService implements IQuizService {
    constructor(private readonly quizRepository: QuizRepository) {}
    getTotal(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<number> {
        return this.quizRepository.getTotal(find, options);
    }
    createQuizzes<T>(
        quiz: T[],
        options?: IDatabaseSaveOptions
    ): Promise<boolean> {
        return this.quizRepository.createMany(quiz, options);
    }
    getQuizzes(
        find?: Record<string, any>,
        options?: IDatabaseSaveOptions
    ): Promise<QuizDoc[]> {
        return this.quizRepository.findAll(find, options);
    }
    getQuizzesByQuizbankId(
        quizbankId: string,
        options?: IDatabaseSaveOptions
    ): Promise<QuizDoc[]> {
        return this.quizRepository.findAll({ quizbank: quizbankId }, options);
    }
    deleteQuizzesByQuizbankId(
        quizbankId: string,
        options?: IDatabaseSaveOptions
    ): Promise<boolean> {
        return this.quizRepository.deleteMany(
            { quizbank: quizbankId },
            options
        );
    }
    updateAIExplanation(
        explanation: string,
        repository: QuizDoc,
        options?: IDatabaseSaveOptions
    ): Promise<QuizDoc> {
        repository.explanation = explanation;
        return this.quizRepository.save(repository, options);
    }
    populateQuiz(repository: QuizDoc): Promise<IQuizEntity> {
        return repository.populate({
            path: 'quizbank',
            select: '-author',
        });
    }
}
