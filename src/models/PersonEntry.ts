import { IPersonEntry } from "./IPersonEntry";

export interface IMarker {
    isDirectRelation: 'self' | 'parent' | 'child' | 'silbling' | null
    isHighlighted: boolean
};

export default class PersonEntry implements IPersonEntry {
    birthdate?: Date | null;
    birthName?: string | null;
    dayOfDeath?: Date | null;
    forename?: string | null;
    id: number | null;
    avatar: string | null;
    bio: string | null;
    lastname?: string | null;
    marriages: number[];
    marriagesWithUsers: number[];
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
        this.avatar = dataObj.avatar;
        this.birthdate = dataObj.birthdate;
        this.bio = dataObj.bio;
        this.birthName = dataObj.birthname;
        this.dayOfDeath = dataObj.dayofdeath;
        this.parents = dataObj.parents != null ? dataObj.parents.map(parent => parseInt(parent.id)) : [];
        this.children = dataObj.children != null ? dataObj.children.map(child => parseInt(child.id)) : [];
        this.marriages = dataObj.marriages != null ? dataObj.marriages.map(marriage => {
            return marriage.id
        }) : [];
        this.marriagesWithUsers = dataObj.marriagesWithUsers != null ? dataObj.marriagesWithUsers.map(marriagesWithUsers => {
            return marriagesWithUsers.id
        }) : [];
        this.placeOfBirth = dataObj.placeofbirth;
        this.placeOfDeath = dataObj.placeofdeath;
        this.markers = {
            isDirectRelation: null,
            isHighlighted: false
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
