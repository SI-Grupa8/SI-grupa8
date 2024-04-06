import { UserRequest } from "./user-request";

export interface CompanyRequest {
    companyName?: string;
    users? : UserRequest[]

}