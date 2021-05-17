import { IPersonAPIEntry } from "./IPersonAPIEntry";

export interface IMarker {
    isDirectRelation: 'self' | 'parent' | 'child' | 'silbling' | null
    isHighlighted: boolean
};

export default class PersonEntry implements IPersonAPIEntry {
    birthdate?: Date | null;
    birthname?: string | null;
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
        this.birthname = dataObj.birthname;
        this.dayOfDeath = dataObj.dayofdeath;
        this.parents = dataObj.parents != null
            ? dataObj.parents
            : [];
        this.children = dataObj.children != null ? dataObj.children.map(child => parseInt(child.id)) : [];
        this.marriages = dataObj.marriages != null
            ? dataObj.marriages
            : [];
        this.marriagesWithUsers = dataObj.marriagesWithUsers != null
            ? dataObj.marriagesWithUsers.map(marriagesWithUsers => {
                return marriagesWithUsers.id
            })
            : [];
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

    public toAPI(): IPersonAPIEntry {
        return {
            birthdate: this.birthdate,
            birthname: this.birthname,
            dayOfDeath: this.dayOfDeath,
            forename: this.forename,
            id: this.id,
            avatar: this.avatar,
            bio: this.bio,
            lastname: this.lastname,
            marriages: this.marriages,
            parents: this.parents,
            children: this.children,
            placeOfBirth: this.placeOfBirth,
            placeOfDeath: this.placeOfDeath,
            gender: this.gender,
            markers: this.markers
        };
    }
}
