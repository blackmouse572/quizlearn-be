import {
    IDatabaseFindAllOptions,
    IDatabaseSaveOptions,
    IDatabaseSoftDeleteManyOptions,
} from 'src/common/database/interfaces/database.interface';
import {
    UserDoc,
    UserEntity,
} from 'src/modules/accounts/repository/entities/user.entity';
import { QuizbankCreateDto } from 'src/modules/quizbank/dtos/quizbank-create.dto';
import {
    QuizDoc,
    QuizEntity,
} from 'src/modules/quizbank/repository/entities/quiz.entity';
import {
    QuizbankDoc,
    QuizbankEntity,
} from 'src/modules/quizbank/repository/entities/quizbank.entity';

export interface IQuizbankService {
    findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<IQuizbankEntity[]>;
    findOneById(
        _id: string,
        options?: IDatabaseFindAllOptions
    ): Promise<IQuizbankEntity>;
    findOne(
        find: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<IQuizbankEntity>;
    createQuizbank(
        payload: QuizbankCreateDto,
        user: UserDoc,
        options?: IDatabaseFindAllOptions
    ): Promise<QuizbankDoc>;
    getTotal(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<number>;
    getTotalQuiz(
        repository: QuizbankDoc,
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<number>;
    saveWithQuizzes(
        { quizes, ...rest }: QuizbankCreateDto,
        repository: QuizbankDoc,
        options?: IDatabaseFindAllOptions<any>
    ): Promise<QuizbankDoc>;
    save(
        repository: QuizbankDoc,
        options?: IDatabaseSaveOptions
    ): Promise<QuizbankDoc>;
    delete(
        repository: QuizbankDoc,
        options?: IDatabaseSoftDeleteManyOptions
    ): Promise<QuizbankDoc>;
}
export interface IQuizbankDoc extends Omit<QuizbankDoc, 'author'> {
    quizzes: QuizDoc[];
    author: UserDoc;
    quizCount: number;
}

export interface IQuizbankEntity extends Omit<QuizbankEntity, 'author'> {
    quizzes?: QuizEntity[];
    author: UserEntity;
    quizCount: number;
}
