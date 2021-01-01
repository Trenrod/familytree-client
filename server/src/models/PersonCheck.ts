import { Person } from "../restapi/Api";

export function isPerson(obj: any): obj is Person {
    return typeof obj.forename === "string" && typeof obj.lastname === "string";
}
