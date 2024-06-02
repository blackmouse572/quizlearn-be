import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const CLASSROOM_DEFAULT_PER_PAGE = 20;
export const CLASSROOM_DEFAULT_ORDER_BY = 'createdAt';
export const CLASSROOM_DEFAULT_ORDER_DIRECTION =
    ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC;
export const CLASSROOM_DEFAULT_AVAILABLE_ORDER_BY = ['className', 'createdAt'];
export const CLASSROOM_DEFAULT_AVAILABLE_SEARCH = ['className'];
