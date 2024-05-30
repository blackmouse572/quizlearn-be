import {
    IDatabaseCreateOptions,
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
} from 'src/common/database/interfaces/database.interface';
import { UserDoc } from 'src/modules/accounts/repository/entities/user.entity';
import { CreateClassroomDto } from 'src/modules/classroom/dtos/classroom-create.dto';
import { IClassroomDoc } from 'src/modules/classroom/interfaces/classroom.interface';
import { ClassroomDoc } from 'src/modules/classroom/repository/entity/classroom.entity';

export interface ClassroomServiceInterface {
    create: (
        data: CreateClassroomDto,
        options?: IDatabaseCreateOptions
    ) => Promise<ClassroomDoc>;
    findOneById: (
        id: string,
        options?: IDatabaseFindOneOptions
    ) => Promise<ClassroomDoc>;
    findAllByAuthor: (
        author: string,
        options: IDatabaseFindAllOptions
    ) => Promise<ClassroomDoc[]>;
    findAll(
        find: Record<string, any>,
        options: IDatabaseFindAllOptions
    ): Promise<ClassroomDoc[]>;
    findOne(
        find: Record<string, any>,
        options: IDatabaseFindOneOptions
    ): Promise<ClassroomDoc>;
    save(data: ClassroomDoc): Promise<ClassroomDoc>;
    populateMembers(data: ClassroomDoc): Promise<IClassroomDoc>;
    populateBankIds(data: ClassroomDoc): Promise<IClassroomDoc>;
    addMember(repository: ClassroomDoc, member: UserDoc): Promise<ClassroomDoc>;
    addManyMembers(
        repository: ClassroomDoc,
        members: UserDoc[]
    ): Promise<ClassroomDoc>;
    total(find: Record<string, any>): Promise<number>;
}
