import {
    IDatabaseCreateOptions,
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
    IDatabaseGetTotalOptions,
} from 'src/common/database/interfaces/database.interface';
import { CreateClassroomCodeDto } from 'src/modules/classroom/dtos/classroom-code.dto';
import { ClassroomCodeDoc } from 'src/modules/classroom/repository/entity/classroom-code.entity';

export interface IClassroomCodeService {
    findAll<T>(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<T[]>;
    findAllByAuthor<T>(
        _author: string,
        options?: IDatabaseFindAllOptions
    ): Promise<T[]>;
    findOneById<T>(_id: string, options?: IDatabaseFindOneOptions): Promise<T>;
    findOne<T>(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<T>;
    getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number>;
    create(
        {}: CreateClassroomCodeDto,
        options?: IDatabaseCreateOptions
    ): Promise<ClassroomCodeDoc>;
}
