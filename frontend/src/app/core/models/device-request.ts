import { DeviceType } from "./device-type";

export interface DeviceRequest {
    userID?: number;
    reference?: string;
    deviceName?:string;
    xCoordinate?: string;
    yCoordinate?: string;
    deviceID?: number;
    deviceTypeID? : number;
    deviceType?: DeviceType;
    
}
