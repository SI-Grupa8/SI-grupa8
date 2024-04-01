export interface UserRequest {
    userID?: number;
    name?:string;
    surname?:string;
    email?: string;
    phoneNumber?: string;
    roleID?: number;
    twoFactorKey?: string;
    twoFactorEnabled?: boolean;
    refreshToken?: string;
    tokenCreated?: Date;
    tokenExpires?: Date;
    companyID?: number
}
