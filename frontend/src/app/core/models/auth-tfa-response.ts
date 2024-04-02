export interface AuthTfaResponse {
    token?:string;
    twoFaEnabled?: boolean;
    email?: string;
    refresh?: string;
    expires?: Date;
}
