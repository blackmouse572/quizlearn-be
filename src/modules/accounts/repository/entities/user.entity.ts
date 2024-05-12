import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { CallbackWithoutResultAndOptionalError, Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';

export const UserDatabaseName = 'users';

@DatabaseEntity({ collection: UserDatabaseName })
export class UserEntity extends DatabaseMongoObjectIdEntityAbstract {
    @Prop({
        required: false,
        sparse: true,
        index: true,
        trim: true,
        type: String,
        unique: true,
        maxlength: 100,
    })
    username?: string;

    @Prop({
        required: true,
        index: true,
        trim: true,
        type: String,
        maxlength: 50,
    })
    fullName: string;

    @Prop({
        required: false,
        sparse: true,
        trim: true,
        type: String,
        default: '',
    })
    avatar?: string;

    @Prop({
        required: true,
        index: true,
        unique: true,
        trim: true,
        lowercase: true,
        type: String,
        maxlength: 100,
    })
    email: string;

    @Prop({
        required: true,
        index: true,
        lowercase: true,
        trim: true,
        type: String,
        default: 'user',
    })
    role: 'admin' | 'user';

    @Prop({
        required: true,
        type: String,
    })
    passwordHash: string;

    @Prop({
        type: Date,
    })
    verified?: Date;

    @Prop({
        type: String,
    })
    verificationToken: string;

    @Prop({
        required: true,
        type: Date,
        default: Date.now,
    })
    dob: Date;

    @Prop({
        required: true,
        type: Number,
    })
    useAICount: number;

    @Prop({
        required: true,
        type: Boolean,
        default: false,
    })
    isBan: boolean;

    @Prop({
        required: true,
        type: Boolean,
        default: false,
    })
    isWarning: boolean;

    @Prop({
        type: String,
        default: '',
    })
    resetToken: string;

    @Prop({
        type: Date,
    })
    resetTokenExpires: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);

export type UserDoc = UserEntity & Document;

UserSchema.pre('save', function (next: CallbackWithoutResultAndOptionalError) {
    this.email = this.email.toLowerCase();
    this.fullName = this.fullName.toLowerCase();
    this.email = this.email.toLowerCase();

    next();
});
