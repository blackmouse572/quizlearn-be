import {
    UserDoc,
    UserEntity,
} from 'src/modules/accounts/repository/entities/user.entity';
import {
    ClassroomDoc,
    ClassroomEntity,
} from 'src/modules/classroom/repository/entity/classroom.entity';

export type IClassroomDoc = Omit<ClassroomDoc, 'author' | 'accountIds'> & {
    author: UserDoc;
    accountIds: UserDoc[];
};

export type IClassroomEntity = Omit<
    ClassroomEntity,
    'author' | 'accountIds'
> & {
    author: UserEntity;
    accountIds: UserEntity[];
};
