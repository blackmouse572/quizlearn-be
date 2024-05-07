import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
import { HelperDateService } from 'src/common/helpers/services/helper.date.service';
import { UserCreateDto } from 'src/modules/accounts/dtos/user-create.dto';
import { UserUpdateAICountDto } from 'src/modules/accounts/dtos/user-update-ai-count.dto';
import { UserUpdateUsernameDto } from 'src/modules/accounts/dtos/user-update-username.dto';
import { UserUpdateNameDto } from 'src/modules/accounts/dtos/user-update.dto';
import { IUserService } from 'src/modules/accounts/interfaces/user.service.interface';
import {
    UserDoc,
    UserEntity,
} from 'src/modules/accounts/repository/entities/user.entity';
import { UserRepository } from 'src/modules/accounts/repository/repositories/user.repository';

@Injectable()
export class UserService implements IUserService {
    increasePasswordAttempt(user: UserDoc) {
        throw new Error('Method not implemented.');
    }
    resetPasswordAttempt(user: UserDoc, arg1: unknown) {
        throw new Error('Method not implemented.');
    }
    updatePhoto(user: UserDoc, aws: AwsS3Serialization) {
        throw new Error('Method not implemented.');
    }
    private readonly uploadPath: string;

    private readonly mobileNumberCountryCodeAllowed: string[];

    constructor(
        private readonly userRepository: UserRepository,
        private readonly helperDateService: HelperDateService,
        private readonly configService: ConfigService
    ) {
        this.uploadPath = this.configService.get<string>('user.uploadPath');

        this.mobileNumberCountryCodeAllowed = this.configService.get<string[]>(
            'user.mobileNumberCountryCodeAllowed'
        );
    }
    updateUsername(
        repository: UserDoc,
        { username }: UserUpdateUsernameDto,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc> {
        repository.username = username;
        return this.userRepository.save(repository, options);
    }
    updateVerifyToken(
        repository: UserDoc,
        token: string,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc> {
        repository.verificationToken = token;
        return this.userRepository.save(repository, options);
    }
    updateResetToken(
        repository: UserDoc,
        resetToken: string,
        resetTokenExpires: Date,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc> {
        repository.resetToken = resetToken;
        repository.resetTokenExpires = resetTokenExpires;
        return this.userRepository.save(repository, options);
    }

    async findAll<T = UserDoc>(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<T[]> {
        return this.userRepository.findAll<T>(find, options);
    }

    async findOneById<T>(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        return this.userRepository.findOneById<T>(_id, options);
    }

    async findOne<T>(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        return this.userRepository.findOne<T>(find, options);
    }

    async findOneByUsername<T>(
        username: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        return this.userRepository.findOne<T>({ username }, options);
    }

    async findOneByEmail<T>(
        email: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        return this.userRepository.findOne<T>({ email }, options);
    }

    async findOneByMobileNumber<T>(
        mobileNumber: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        return this.userRepository.findOne<T>({ mobileNumber }, options);
    }

    async getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number> {
        return this.userRepository.getTotal(find, { ...options, join: true });
    }

    async create(
        { email, fullName, useAICount, dob, role }: UserCreateDto,
        { passwordHash }: IAuthPassword,
        options?: IDatabaseCreateOptions
    ): Promise<UserDoc> {
        const create: UserEntity = new UserEntity();
        create.fullName = fullName;
        create.email = email;
        create.passwordHash = passwordHash;
        create.role = role;
        create.avatar = 'https://avatar.iran.liara.run/public';
        create.isBan = false;
        create.isWarning = false;
        create.dob = dob;
        create.useAICount = useAICount;

        return this.userRepository.create<UserEntity>(create, options);
    }

    async existByEmail(
        email: string,
        options?: IDatabaseExistOptions
    ): Promise<boolean> {
        return this.userRepository.exists(
            {
                email: {
                    $regex: new RegExp(`\\b${email}\\b`),
                    $options: 'i',
                },
            },
            { ...options, withDeleted: true }
        );
    }

    async existByMobileNumber(
        mobileNumber: string,
        options?: IDatabaseExistOptions
    ): Promise<boolean> {
        return this.userRepository.exists(
            {
                mobileNumber,
            },
            { ...options, withDeleted: true }
        );
    }

    async existByUsername(
        username: string,
        options?: IDatabaseExistOptions
    ): Promise<boolean> {
        return this.userRepository.exists(
            { username },
            { ...options, withDeleted: true }
        );
    }

    async delete(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc> {
        return this.userRepository.softDelete(repository, options);
    }

    async updateName(
        repository: UserDoc,
        { fullName }: UserUpdateNameDto,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc> {
        repository.fullName = fullName;

        return this.userRepository.save(repository, options);
    }

    async updatePassword(
        repository: UserDoc,
        { passwordHash }: IAuthPassword,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc> {
        repository.passwordHash = passwordHash;

        return this.userRepository.save(repository, options);
    }

    async verify(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserEntity> {
        repository.verified = this.helperDateService.create();

        return this.userRepository.save(repository, options);
    }

    async inactive(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc> {
        repository.verified = undefined;
        return this.userRepository.save(repository, options);
    }

    async banned(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc> {
        repository.isBan = true;

        return this.userRepository.save(repository, options);
    }

    async unbanned(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc> {
        repository.isBan = false;

        return this.userRepository.save(repository, options);
    }

    async updateUserAICount(
        repository: UserDoc,
        { useAICount }: UserUpdateAICountDto,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc> {
        repository.useAICount = useAICount;

        return this.userRepository.save(repository, options);
    }

    async decreaseUserAICount(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc> {
        let currentCount = repository.useAICount;
        if (currentCount > 0) {
            currentCount--;
        }
        repository.useAICount = currentCount;

        return this.userRepository.save(repository, options);
    }

    async resetUserAICount(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc> {
        repository.useAICount = 0;

        return this.userRepository.save(repository, options);
    }

    async getUploadPath(user: string): Promise<string> {
        return this.uploadPath.replace('{user}', user);
    }

    async deleteMany(
        find: Record<string, any>,
        options?: IDatabaseManyOptions
    ): Promise<boolean> {
        return this.userRepository.deleteMany(find, options);
    }

    async getMobileNumberCountryCodeAllowed(): Promise<string[]> {
        return this.mobileNumberCountryCodeAllowed;
    }

    async existByEmails(
        emails: string[],
        options?: IDatabaseExistOptions
    ): Promise<boolean> {
        return this.userRepository.exists(
            {
                email: {
                    $regex: new RegExp(`\\b${emails.join('|')}\\b`),
                    $options: 'i',
                },
            },
            { ...options, withDeleted: true }
        );
    }
}
