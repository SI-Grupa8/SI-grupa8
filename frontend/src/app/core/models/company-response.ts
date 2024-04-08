import { UserRequest } from "./user-request";

export interface CompanyResponse {
    companyID?: number,
    companyName?: string;
    users? : UserRequest;

}