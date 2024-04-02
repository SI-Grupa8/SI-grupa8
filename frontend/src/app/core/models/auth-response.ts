export interface AuthResponse {
    email?:string | undefined;
    token?: string;
    twoFaEnabled?: boolean;
    refresh?: string;
    expires?: Date;
}
