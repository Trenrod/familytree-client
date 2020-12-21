export interface IPersonEntry {
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
    markers?: { isDirectRelation: 'self' | 'parent' | 'child' | 'silbling' | null }
}