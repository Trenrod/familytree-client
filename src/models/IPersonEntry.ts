export interface IPersonEntry {
    id: number | null;
    forename?: string | null;
    lastname?: string | null;
    birthdate?: Date | null;
    birthName?: string | null;
    dayOfDeath?: Date | null;
    parents: number[];
    children: number[];
    marriages: number[];
    placeOfBirth?: string | null;
    placeOfDeath?: string | null;
    gender?: "m" | "f" | null;
    markers?: { isDirectRelation: 'self' | 'parent' | 'child' | 'silbling' | null }
}