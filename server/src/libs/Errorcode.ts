
export interface FTError {
    message: string;
    code: number;
}

export enum ERROR_CODES {
    ERROR_INVALID_REQUEST = 100,
    ERROR_INTERNAL_SERVER_ERROR = 101,
    ERROR_MARRIED_PERSON_NOT_FOUND = 102,
}


