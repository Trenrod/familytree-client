import { IPersonEntry } from "./IPersonEntry";

export interface IMarker {
    isDirectRelation: 'self' | 'parent' | 'child' | 'silbling' | null
};

export default class PersonEntry implements IPersonEntry {
    birthdate?: Date | null;
    birthName?: string | null;
    dayOfDeath?: Date | null;
    forename?: string | null;
    id: number | null;
    lastname?: string | null;
    marriages: number[];
    parents: number[];
    children: number[];
    placeOfBirth?: string | null;
    placeOfDeath?: string | null;
    gender?: "m" | "f" | null;
    markers?: IMarker | null;

    constructor(dataObj: any) {
        this.id = dataObj.id !== '' ? parseInt(dataObj.id) : null;
        this.forename = dataObj.forename;
        this.lastname = dataObj.lastname;
        this.birthdate = dataObj.birthdate;
        this.birthName = dataObj.birthname;
        this.dayOfDeath = dataObj.dayofdeath;
        this.parents = dataObj.parents != null ? dataObj.parents.map(parent => parseInt(parent.id)) : [];
        this.children = dataObj.children != null ? dataObj.children.map(child => parseInt(child.id)) : [];
        this.marriages = dataObj.marriages != null ? dataObj.marriages.map(marriage => {
            return marriage.id
        }) : [];
        this.placeOfBirth = dataObj.placeofbirth;
        this.placeOfDeath = dataObj.placeofdeath;
        this.markers = {
            isDirectRelation: null
        };
        this.gender = dataObj.gender
    }
    public setLastname(value: string): PersonEntry {
        this.forename = value;
        return this;
    }
    public setForename(value: string): PersonEntry {
        this.lastname = value;
        return this;
    }
}
