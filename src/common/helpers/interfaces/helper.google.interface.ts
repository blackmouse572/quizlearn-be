export interface IHelperGooglePayload {
    email: string;
}

export interface IHelperGoogleRefresh {
    accessToken: string;
}

export interface IHelperGoogleService {
    getTokenInfo(accessToken: string): Promise<IHelperGooglePayload>;
    refreshToken(refreshToken: string): Promise<IHelperGoogleRefresh>;
}
