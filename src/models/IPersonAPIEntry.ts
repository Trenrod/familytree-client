export interface IPersonAPIEntry {
    id: number | null | undefined;
    avatar?: string | null;
    forename?: string | null;
    lastname?: string | null;
    birthdate?: Date | null;
    birthname?: string | null;
    dayOfDeath?: Date | null;
    bio: string | null;
    parents: number[] | null;
    children: number[] | null;
    marriages: number[] | undefined;
    // marriagesWithUsers: number[] | undefined;
    placeOfBirth?: string | null;
    placeOfDeath?: string | null;
    gender?: "m" | "f" | null;
    markers?: { isDirectRelation: 'self' | 'parent' | 'child' | 'silbling' | null }
}