import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const USER_ACTIVE_META_KEY = 'UserActiveMetaKey';
export const USER_INACTIVE_PERMANENT_META_KEY = 'UserInactivePermanentMetaKey';
export const USER_BLOCKED_META_KEY = 'UserBlockedMetaKey';

export enum ENUM_USER_SIGN_UP_FROM {
    PUBLIC = 'PUBLIC',
    ADMIN = 'ADMIN',
}

export const USER_DEFAULT_PER_PAGE = 20;
export const USER_DEFAULT_ORDER_BY = 'createdAt';
export const USER_DEFAULT_ORDER_DIRECTION =
    ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC;
export const USER_DEFAULT_AVAILABLE_ORDER_BY = [
    'username',
    'fullName',
    'email',
    'createdAt',
];
export const USER_DEFAULT_AVAILABLE_SEARCH = ['username', 'fullName', 'email'];

export const USER_DEFAULT_IS_ACTIVE = [true, false];
export const USER_DEFAULT_BLOCKED = [true, false];
export const USER_DEFAULT_INACTIVE_PERMANENT = [true, false];
