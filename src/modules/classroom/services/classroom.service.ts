import { Injectable } from '@nestjs/common';
import {
    IDatabaseCreateOptions,
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
} from 'src/common/database/interfaces/database.interface';
import {
    UserDoc,
    UserEntity,
} from 'src/modules/accounts/repository/entities/user.entity';
import { CreateClassroomDto } from 'src/modules/classroom/dtos/classroom-create.dto';
import { IClassroomDoc } from 'src/modules/classroom/interfaces/classroom.interface';
import { ClassroomDoc } from 'src/modules/classroom/repository/entity/classroom.entity';
import { ClassroomRepository } from 'src/modules/classroom/repository/repositories/classroom.repository';
import { ClassroomServiceInterface } from 'src/modules/classroom/services/classroom-service.interface';
import { QuizbankEntity } from 'src/modules/quizbank/repository/entities/quizbank.entity';

@Injectable()
export class ClassroomService implements ClassroomServiceInterface {
    constructor(private readonly classroomRepository: ClassroomRepository) {}
    create(
        data: CreateClassroomDto,
        options?: IDatabaseCreateOptions<any>
    ): Promise<ClassroomDoc> {
        return this.classroomRepository.create(data, options);
    }
    findOneById(
        id: string,
        options?: IDatabaseFindOneOptions<any>
    ): Promise<ClassroomDoc> {
        return this.classroomRepository.findOneById(id, options);
    }
    findAllByAuthor(
        author: string,
        options: IDatabaseFindAllOptions<any>
    ): Promise<ClassroomDoc[]> {
        return this.classroomRepository.findAll(
            {
                authorId: author,
            },
            options
        );
    }
    findAll(
        find: Record<string, any>,
        options?: IDatabaseFindAllOptions<any>
    ): Promise<ClassroomDoc[]> {
        return this.classroomRepository.findAll(find, options);
    }
    save<T extends ClassroomDoc>(data: T) {
        return this.classroomRepository.save(data);
    }
    populateMembers(data: ClassroomDoc): Promise<IClassroomDoc> {
        return data.populate({
            path: 'accountIds',
            localField: 'accountIds',
            foreignField: '_id',
            model: UserEntity.name,
            // remove password, role, tokens
            select: '-password -role -verificationToken -useAICount -resetToken -resetTokenExpires',
        });
    }
    populateBankIds(data: ClassroomDoc): Promise<IClassroomDoc> {
        return data.populate({
            path: 'bankIds',
            localField: 'bankIds',
            foreignField: '_id',
            model: QuizbankEntity.name,
        });
    }
    addMember(
        repository: ClassroomDoc,
        member: UserDoc
    ): Promise<ClassroomDoc> {
        const accountIds = repository.accountIds;
        accountIds.push(member._id);
        repository.accountIds = accountIds;
        return this.save(repository);
    }
    removeMember(
        repository: ClassroomDoc,
        member: UserDoc
    ): Promise<ClassroomDoc> {
        const accountIds = repository.accountIds;
        repository.accountIds = accountIds.filter(
            (accountId) => accountId.toString() !== member._id.toString()
        );
        return this.save(repository);
    }
    removeManyMembers(
        repository: ClassroomDoc,
        members: UserDoc[]
    ): Promise<ClassroomDoc> {
        const accountIds = repository.accountIds;
        repository.accountIds = accountIds.filter((accountId) => {
            return !members.some(
                (member) => member._id.toString() === accountId.toString()
            );
        });
        return this.save(repository);
    }
    addManyMembers(
        repository: ClassroomDoc,
        members: UserDoc[]
    ): Promise<ClassroomDoc> {
        const accountIds = repository.accountIds;
        members.forEach((member) => {
            accountIds.push(member._id);
        });
        repository.accountIds = accountIds;
        return this.save(repository);
    }

    total(find: Record<string, any>): Promise<number> {
        return this.classroomRepository.getTotal(find);
    }

    findOne<T>(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions<any>
    ): Promise<T> {
        return this.classroomRepository.findOne(find, options);
    }

    banManyUser(repository: ClassroomDoc, users: UserDoc[]) {
        const ids = users.map((user) => user._id);

        const bannedIds = repository.bannedAccountIds;
        const uniqueBnnedIds = new Set([...bannedIds, ...ids]);

        repository.bannedAccountIds = Array.from(uniqueBnnedIds);

        // remove banned user from accountIds
        const accountIds = repository.accountIds;
        ids.forEach((id) => {
            accountIds.splice(accountIds.indexOf(id), 1);
        });
        repository.accountIds = accountIds;
        return this.save(repository);
    }

    unbanManyUser(repository: ClassroomDoc, users: UserDoc[]) {
        const ids = users.map((user) => user._id);

        const bannedIds = repository.bannedAccountIds;

        repository.bannedAccountIds = bannedIds.filter(
            (bannedId) => !ids.includes(bannedId)
        );

        return this.save(repository);
    }

    addQuizbank(repository: ClassroomDoc, quizbank: QuizbankEntity) {
        const bankIds = repository.bankIds;
        bankIds.push(quizbank._id as any);
        repository.bankIds = bankIds;
        return this.save(repository);
    }

    delete(repository: ClassroomDoc) {
        return this.classroomRepository.delete(repository);
    }
}
