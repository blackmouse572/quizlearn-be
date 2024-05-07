import { Request } from 'express';
import { RequestPaginationSerialization } from 'src/common/pagination/interfaces/request.pagination';

export interface IRequestApp extends Request {
    apiKey?: Record<string, any>;
    user?: Record<string, any>;

    __id: string;
    __xTimestamp?: number;
    __timestamp: number;
    __timezone: string;
    __customLang: string[];
    __xCustomLang: string;
    __version: string;
    __repoVersion: string;
    __userAgent: string; // TODO: use user-agent library

    __class?: string;
    __function?: string;

    __filters?: Record<
        string,
        string | number | boolean | Array<string | number | boolean>
    >;
    __pagination?: RequestPaginationSerialization;
}
