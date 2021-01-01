import { Marriage } from "../restapi/Api";

export function isMarriage(obj: any): obj is Marriage {
    return typeof obj.personId1 === "number" && typeof obj.personId2 === "number";
}
