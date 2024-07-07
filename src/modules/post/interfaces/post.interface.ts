import {
    UserDoc,
    UserEntity,
} from 'src/modules/accounts/repository/entities/user.entity';
import {
    ClassroomDoc,
    ClassroomEntity,
} from 'src/modules/classroom/repository/entity/classroom.entity';
import { PostDoc, PostEntity } from 'src/modules/post/repository/post.entity';
import { QuizbankDoc } from 'src/modules/quizbank/repository/entities/quizbank.entity';

export type IBasePostDoc = Omit<PostDoc, 'author' | 'classroom'> & {
    author: UserDoc;
    classroom: ClassroomDoc;
};

export type IBaseEntityDoc = Omit<PostEntity, 'author' | 'classroom'> & {
    author: UserEntity;
    classroom: ClassroomEntity;
};

export type IQuizbankPostDoc = Omit<IBasePostDoc, 'bankLink'> & {
    bankLink: QuizbankDoc;
};

export type IQuizbankPostEntity = Omit<IBaseEntityDoc, 'bankLink'> & {
    bankLink: QuizbankDoc;
};
