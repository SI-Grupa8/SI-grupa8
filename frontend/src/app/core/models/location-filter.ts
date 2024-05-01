import { DateTimes } from "./date-times";

export interface LocationFilterRequest {
    deviceTimes: DateTimes;
    deviceIds: number[];
}