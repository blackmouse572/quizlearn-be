import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const POST_DEFAULT_PER_PAGE = 20;
export const POST_DEFAULT_ORDER_BY = 'createdAt';
export const POST_DEFAULT_ORDER_DIRECTION =
    ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC;
export const POST_DEFAULT_AVAILABLE_ORDER_BY = ['title', 'createdAt'];
export const POST_DEFAULT_AVAILABLE_SEARCH = ['title', 'content'];
