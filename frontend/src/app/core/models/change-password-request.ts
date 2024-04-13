export interface ChangePasswordRequest{
    userID?: number;
    currentPassword?:string;
    newPassword?:string;
}