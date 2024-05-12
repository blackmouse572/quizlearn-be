import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const QUIZBANK_DEFAULT_PER_PAGE = 20;
export const QUIZBANK_DEFAULT_ORDER_BY = 'createdAt';
export const QUIZBANK_DEFAULT_ORDER_DIRECTION =
    ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC;
export const QUIZBANK_DEFAULT_AVAILABLE_ORDER_BY = [
    'question',
    'answer',
    'createdAt',
    'updatedAt',
];
export const QUIZBANK_DEFAULT_AVAILABLE_SEARCH = ['question', 'answer'];
export const QUIZBANK_SUBJECT_QUERY_FIELD = 'tag';
export const QUIZBANK_SUBJECT_FIELD = 'tags';
