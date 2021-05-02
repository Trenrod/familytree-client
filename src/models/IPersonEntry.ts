export interface IPersonEntry {
    id: number | null;
    avatar?: string | null;
    forename?: string | null;
    lastname?: string | null;
    birthdate?: Date | null;
    birthName?: string | null;
    dayOfDeath?: Date | null;
    bio: string | null;
    parents: number[];
    children: number[];
    marriages: number[];
    marriagesWithUsers: number[];
    placeOfBirth?: string | null;
    placeOfDeath?: string | null;
    gender?: "m" | "f" | null;
    markers?: { isDirectRelation: 'self' | 'parent' | 'child' | 'silbling' | null }
}