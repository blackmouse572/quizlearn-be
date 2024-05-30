import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { UserDatabaseName } from 'src/modules/accounts/repository/entities/user.entity';

export const ClassroomCodeDatabaseName = 'classroom_codes';

@DatabaseEntity({ collection: ClassroomCodeDatabaseName })
export class ClassroomCodeEntity extends DatabaseMongoObjectIdEntityAbstract {
    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: UserDatabaseName,
    })
    generateBy: string;

    @Prop({
        required: true,
        type: String,
    })
    code: string;

    @Prop({
        required: true,
        type: Date,
    })
    expiredAt: Date;
}

export const ClassroomCodeSchema =
    SchemaFactory.createForClass(ClassroomCodeEntity);
export type ClassroomCodeDoc = ClassroomCodeEntity & Document;
