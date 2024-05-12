import { Injectable } from '@nestjs/common';
import { PipelineStage, Types } from 'mongoose';
import {
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
    IDatabaseSaveOptions,
    IDatabaseSoftDeleteManyOptions,
} from 'src/common/database/interfaces/database.interface';
import {
    UserDatabaseName,
    UserDoc,
    UserEntity,
} from 'src/modules/accounts/repository/entities/user.entity';
import { QuizbankCreateDto } from 'src/modules/quizbank/dtos/quizbank-create.dto';
import {
    IQuizbankDoc,
    IQuizbankEntity,
    IQuizbankService,
} from 'src/modules/quizbank/intefaces/quizbank.service.inteface';
import { QuizEntity } from 'src/modules/quizbank/repository/entities/quiz.entity';
import {
    QuizbankDoc,
    QuizbankEntity,
} from 'src/modules/quizbank/repository/entities/quizbank.entity';
import { QuizbankRepository } from 'src/modules/quizbank/repository/repositories/quizbank.repository';
import { QuizService } from 'src/modules/quizbank/services/quiz.service';

@Injectable()
export class QuizbankService implements IQuizbankService {
    constructor(
        private readonly quizbankRepository: QuizbankRepository,
        private readonly quizService: QuizService
    ) {}
    getTotal(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions<any>
    ): Promise<number> {
        return this.quizbankRepository.getTotal(find, options);
    }
    getTotalQuiz(
        repository: QuizbankDoc,
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions<any>
    ): Promise<number> {
        const { _id } = repository;
        return this.quizService.getTotal({ ...find, quizbank: _id }, options);
    }
    async findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions<any>
    ): Promise<IQuizbankEntity[]> {
        return await this.quizbankRepository
            .findAll(find, {
                ...options,
                join: {
                    path: 'author',
                    select: '-password -salt -verificationToken -resetToken',
                    model: UserEntity.name,
                },
            })
            .then((repositories) => {
                return Promise.all(
                    repositories.map<Promise<IQuizbankEntity>>((repository) =>
                        this.quizService
                            .getTotal({ quizBank: repository._id })
                            .then((quizCount) => {
                                return {
                                    ...repository,
                                    quizCount,
                                } as unknown as IQuizbankEntity;
                            })
                    )
                );
            });
    }
    findOneById(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<IQuizbankDoc> {
        const pipes: PipelineStage[] = [
            {
                $match: {
                    _id: new Types.ObjectId(_id),
                },
            },
            {
                $lookup: {
                    from: UserDatabaseName,
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                },
            },
            {
                $unwind: '$author',
            },
            // average rating
            {
                $addFields: {
                    averageRating: {
                        $avg: '$rating.star',
                    },
                },
            },
            // quiz count
            {
                $lookup: {
                    from: 'quizzes',
                    localField: '_id',
                    foreignField: 'quizBank',
                    as: 'quizzes',
                },
            },
            {
                $addFields: {
                    quizCount: {
                        $size: '$quizzes',
                    },
                },
            },
        ];

        return this.quizbankRepository
            .raw(pipes, options)
            .then((value) => value[0]) as any;
    }
    findOne(
        find: Record<string, any>,
        options?: IDatabaseFindAllOptions<any>
    ): Promise<IQuizbankDoc> {
        return this.quizbankRepository.findOne(find, options);
    }
    async createQuizbank(
        { quizes, ...rest }: QuizbankCreateDto,
        user: UserDoc,
        options?: IDatabaseFindAllOptions<any>
    ): Promise<QuizbankDoc> {
        const create = new QuizbankEntity();
        create.author = user._id;
        create.bankName = rest.bankName;
        create.desciption = rest.desciption;
        create.tags = rest.tags;
        create.visibility = rest.visibility;
        create.rating = [];
        const quizbank = await this.quizbankRepository.create(create, options);

        const quizzesCreate: QuizEntity[] = [];
        quizes.forEach((quiz) => {
            const createQuiz = new QuizEntity();
            createQuiz.answer = quiz.answer;
            createQuiz.question = quiz.question;
            createQuiz.quizBank = quizbank._id;
            quizzesCreate.push(createQuiz);
        });
        this.quizService.createQuizzes(quizzesCreate);

        return quizbank;
    }
    async saveWithQuizzes(
        { quizes, ...rest }: QuizbankCreateDto,
        repository: QuizbankDoc,
        options?: IDatabaseFindAllOptions<any>
    ): Promise<QuizbankDoc> {
        repository.bankName = rest.bankName;
        repository.desciption = rest.desciption;
        repository.tags = rest.tags;
        repository.visibility = rest.visibility;

        // update quizzes
        await this.quizService.deleteQuizzesByQuizbankId(repository._id);
        const quizzesCreate: QuizEntity[] = [];
        quizes.forEach((quiz) => {
            const createQuiz = new QuizEntity();
            createQuiz.answer = quiz.answer;
            createQuiz.question = quiz.question;
            createQuiz.quizBank = repository._id;
            quizzesCreate.push(createQuiz);
        });

        this.quizService.createQuizzes(quizzesCreate);

        return this.quizbankRepository.save(repository, options);
    }

    delete(
        repository: QuizbankDoc,
        options?: IDatabaseSoftDeleteManyOptions
    ): Promise<QuizbankDoc> {
        return this.quizbankRepository.delete(repository, options);
    }
    save(
        repository: QuizbankDoc,
        options?: IDatabaseSaveOptions
    ): Promise<QuizbankDoc> {
        return this.quizbankRepository.save(repository, options);
    }
    async populate(repository: QuizbankDoc): Promise<IQuizbankEntity> {
        const withAuthor = await this.populateAuthor(repository);
        const quizzes = await this.quizService.getQuizzesByQuizbankId(
            repository._id
        );

        return {
            ...withAuthor,
            quizzes,
            quizCount: quizzes.length,
        };
    }

    populateAuthor(repository: QuizbankDoc): Promise<IQuizbankDoc> {
        return repository.populate({
            path: 'author',
            select: '-password -salt -verificationToken -resetToken',
            localField: 'author',
            foreignField: '_id',
            model: UserEntity.name,
        });
    }
}
