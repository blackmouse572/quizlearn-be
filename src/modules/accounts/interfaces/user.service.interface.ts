import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';
import {
    IDatabaseCreateOptions,
    IDatabaseExistOptions,
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
    IDatabaseGetTotalOptions,
    IDatabaseManyOptions,
    IDatabaseSaveOptions,
} from 'src/common/database/interfaces/database.interface';
import { UserCreateDto } from 'src/modules/accounts/dtos/user-create.dto';
import { UserUpdateAICountDto } from 'src/modules/accounts/dtos/user-update-ai-count.dto';
import { UserUpdateUsernameDto } from 'src/modules/accounts/dtos/user-update-username.dto';
import { UserUpdateNameDto } from 'src/modules/accounts/dtos/user-update.dto';
import {
    UserDoc,
    UserEntity,
} from 'src/modules/accounts/repository/entities/user.entity';

export interface IUserService {
    findAll<T>(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<T[]>;
    findOneById<T>(_id: string, options?: IDatabaseFindOneOptions): Promise<T>;
    findOne<T>(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<T>;
    findOneByUsername<T>(
        username: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T>;
    findOneByEmail<T>(
        email: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T>;
    findOneByMobileNumber<T>(
        mobileNumber: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T>;
    getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number>;
    create(
        {}: UserCreateDto,
        { passwordExpired, passwordHash, salt, passwordCreated }: IAuthPassword,
        options?: IDatabaseCreateOptions
    ): Promise<UserDoc>;
    existByEmail(
        email: string,
        options?: IDatabaseExistOptions
    ): Promise<boolean>;
    existByUsername(
        username: string,
        options?: IDatabaseExistOptions
    ): Promise<boolean>;
    delete(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    updateName(
        repository: UserDoc,
        {}: UserUpdateNameDto,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    updateUsername(
        repository: UserDoc,
        { username }: UserUpdateUsernameDto,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    updatePassword(
        repository: UserDoc,
        { passwordHash, passwordExpired, salt, passwordCreated }: IAuthPassword,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    verify(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserEntity>;
    updateVerifyToken(
        repository: UserDoc,
        token: string,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    banned(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    unbanned(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    updateUserAICount(
        repository: UserDoc,
        { useAICount }: UserUpdateAICountDto,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    decreaseUserAICount(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    resetUserAICount(
        repository: UserDoc,
        // currentPlan: PlanDoc, // todo: add plan
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    deleteMany(
        find: Record<string, any>,
        options?: IDatabaseManyOptions
    ): Promise<boolean>;
    existByEmails(
        emails: string[],
        options?: IDatabaseExistOptions
    ): Promise<boolean>;
    updateResetToken(
        repository: UserDoc,
        resetToken: string,
        resetTokenExpires: Date,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
}
