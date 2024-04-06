import { UserRequest } from "./user-request";

export interface CompanyRequest {
    companyID?: number,
    companyName?: string;
    users? : UserRequest[]

}