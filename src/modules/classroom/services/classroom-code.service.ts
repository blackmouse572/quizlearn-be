import { Injectable } from '@nestjs/common';
import {
    IDatabaseCreateOptions,
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
    IDatabaseGetTotalOptions,
} from 'src/common/database/interfaces/database.interface';
import { CreateClassroomCodeDto } from 'src/modules/classroom/dtos/classroom-code.dto';
import {
    ClassroomCodeDoc,
    ClassroomCodeEntity,
} from 'src/modules/classroom/repository/entity/classroom-code.entity';
import { ClassroomDoc } from 'src/modules/classroom/repository/entity/classroom.entity';
import { ClassroomCodeRepository } from 'src/modules/classroom/repository/repositories/classroom-code.repository';
import { IClassroomCodeService } from 'src/modules/classroom/services/classroom-code-service.interface';

@Injectable()
export class ClassroomCodeService implements IClassroomCodeService {
    constructor(
        private readonly classroomCodeRepository: ClassroomCodeRepository
    ) {}
    findAll<T>(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions<any>
    ): Promise<T[]> {
        return this.classroomCodeRepository.findAll(find, options);
    }
    findAllByAuthor<T>(
        _author: string,
        options?: IDatabaseFindAllOptions<any>
    ): Promise<T[]> {
        return this.classroomCodeRepository.findAll(
            {
                authorId: _author,
            },
            options
        );
    }
    findOneById<T>(
        _id: string,
        options?: IDatabaseFindOneOptions<any>
    ): Promise<T> {
        return this.classroomCodeRepository.findOneById(_id, options);
    }
    findOne<T>(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions<any>
    ): Promise<T> {
        return this.classroomCodeRepository.findOne(find, options);
    }
    getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number> {
        return this.classroomCodeRepository.getTotal(find, options);
    }
    create(
        { code, expiredAt, generateBy }: CreateClassroomCodeDto,
        options?: IDatabaseCreateOptions<any>
    ): Promise<ClassroomCodeDoc> {
        const data = new ClassroomCodeEntity();
        data.code = code;
        data.expiredAt = expiredAt;
        data.generateBy = generateBy;
        return this.classroomCodeRepository.create(data, options);
    }
}
