import { IPersonEntry } from "./IPersonEntry";

export interface IMarker {
    isDirectRelation: 'self' | 'parent' | 'child' | 'silbling' | null
};

export default class PersonEntry implements IPersonEntry {
    birthdate?: Date | null;
    birthName?: string | null;
    dayOfDeath?: Date | null;
    fatherId?: number | null;
    forename?: string | null;
    id: number | null;
    lastname?: string | null;
    marriedToId?: number[];
    motherId?: number | null;
    placeOfBirth?: string | null;
    placeOfDeath?: string | null;
    gender?: "m" | "f" | null;
    markers?: IMarker | null;

    constructor(dataObj: any) {
        this.birthdate = dataObj.birthdate;
        this.birthName = dataObj.birthname;
        this.dayOfDeath = dataObj.dayofdeath;
        this.fatherId = dataObj.fatherId != null ? parseInt(dataObj.fatherId) : null;
        this.motherId = dataObj.motherId != null ? parseInt(dataObj.motherId) : null;
        this.forename = dataObj.forename;
        this.id = dataObj.id !== '' ? parseInt(dataObj.id) : null;
        this.lastname = dataObj.lastname;
        this.marriedToId = dataObj.hasOwnProperty('marriedtoId') && dataObj.marriedtoId !== '' ? dataObj.marriedtoId.split(',').map(marriedId =>
            parseInt(marriedId)
        ) : [];
        this.placeOfBirth = dataObj.placeofbirth;
        this.placeOfDeath = dataObj.placeofdeath;
        this.markers = {
            isDirectRelation: null
        };
        this.gender = dataObj.gender
    }
    public setBirthName(value: string): PersonEntry {
        this.birthName = value;
        return this;
    }

    public setPlaceOfBirth(value: string): PersonEntry {
        this.placeOfBirth = value;
        return this;
    }
    public setLastname(value: string): PersonEntry {
        this.forename = value;
        return this;
    }
    public setForename(value: string): PersonEntry {
        this.lastname = value;
        return this;
    }
    public setPlaceOfDeath(value: string): PersonEntry {
        this.placeOfDeath = value;
        return this;
    }
    public setFatherId(value: number | null): PersonEntry {
        this.fatherId = value;
        return this;
    }
}
