import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { UserDatabaseName } from 'src/modules/accounts/repository/entities/user.entity';
import { ClassroomCodeDatabaseName } from 'src/modules/classroom/repository/entity/classroom-code.entity';
import { QuizBankDatabaseName } from 'src/modules/quizbank/repository/entities/quizbank.entity';

export const ClassroomDatabaseName = 'classrooms';

@DatabaseEntity({ collection: ClassroomDatabaseName })
export class ClassroomEntity extends DatabaseMongoObjectIdEntityAbstract {
    @Prop({
        required: true,
        index: true,
        trim: true,
        minlength: 1,
        maxlength: 1000,
        type: String,
    })
    className: string;

    @Prop({
        index: true,
        default: '',
        maxlength: 1000,
        trim: true,
        type: String,
    })
    description: string;

    @Prop({
        required: true,
        ref: UserDatabaseName,
        type: Types.ObjectId,
    })
    author: string;

    @Prop({
        required: true,
        default: [],
        ref: QuizBankDatabaseName,
        type: [Types.ObjectId],
    })
    bankIds: string[];

    @Prop({
        required: true,
        default: [],
        type: [Types.ObjectId],
        ref: ClassroomCodeDatabaseName,
    })
    classroomCodes: string[];

    @Prop({
        required: true,
        default: [],
        type: [Types.ObjectId],
        ref: UserDatabaseName,
    })
    accountIds: string[];

    @Prop({
        required: false,
        type: [Types.ObjectId],
        ref: UserDatabaseName,
    })
    bannedAccountIds?: string[];

    @Prop({
        required: true,
        type: Boolean,
        default: false,
    })
    isStudentAllowInvite: boolean;
}

export type ClassroomDoc = ClassroomEntity & Document;
export const ClassroomSchema = SchemaFactory.createForClass(ClassroomEntity);
