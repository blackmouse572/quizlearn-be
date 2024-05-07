import {
    DATABASE_CREATED_AT_FIELD_NAME,
    DATABASE_DELETED_AT_FIELD_NAME,
    DATABASE_UPDATED_AT_FIELD_NAME,
} from 'src/common/database/constants/database.constraint';

export abstract class DatabaseBaseEntityAbstract<T = any> {
    abstract _id: T;
    abstract [DATABASE_DELETED_AT_FIELD_NAME]?: Date;
    abstract [DATABASE_CREATED_AT_FIELD_NAME]?: Date;
    abstract [DATABASE_UPDATED_AT_FIELD_NAME]?: Date;
}
