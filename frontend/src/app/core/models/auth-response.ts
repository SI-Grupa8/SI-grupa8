export interface AuthResponse {
    email?:string | undefined;
    token?: string;
    twoFaEnabled?: boolean;
}
