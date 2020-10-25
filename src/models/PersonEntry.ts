class PersonEntry {
    birthdate?: string | null;
    birthName?: string | null;
    dayOfDeath?: string | null;
    fatherId?: number | null;
    forename?: string | null;
    id: number | null;
    lastname?: string | null;
    marriedToId?: number[];
    motherId?: number | null;
    placeOfBirth?: string | null;
    placeOfDeath?: string | null;
    markers?: {isDirectRelation: 'self'|'parent'| 'child'| 'silbling'| null}

    constructor(dataObj: any) {
        this.birthdate = dataObj.birthdate;
        this.birthName = dataObj.birthname;
        this.dayOfDeath = dataObj.dayofdeath;
        this.fatherId = dataObj.fatherid !== ''? parseInt(dataObj.fatherid): null;
        this.forename = dataObj.forename;
        this.id = dataObj.id !== ''? parseInt(dataObj.id): null;
        this.lastname = dataObj.lastname;
        this.marriedToId = dataObj.marriedtoid !== ''? dataObj.marriedtoid.split(',').map(marriedId => 
            parseInt(marriedId)
        ) : [];
        this.motherId = dataObj.motherid !== ''? parseInt(dataObj.motherid): null;
        this.placeOfBirth = dataObj.placeofbirth;
        this.placeOfDeath = dataObj.placeofdeath;
        this.markers = {
            isDirectRelation: null
        };
    }
}

export default PersonEntry;
