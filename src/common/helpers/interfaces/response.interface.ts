// metadata
export interface IResponseMetadata {
    total?: number;
    hasMore?: boolean;
    skip?: number;
    take?: number;
    [key: string]: any;
}
// response
export interface IResponse {
    _metadata?: IResponseMetadata;
    data?: Record<string, any>;
}

// response pagination
export interface IResponsePagingPagination {
    totalPage: number;
    total: number;
}

export interface IResponsePaging {
    metadata?: IResponseMetadata;
    _pagination: IResponsePagingPagination;
    data: Record<string, any>[];
}
