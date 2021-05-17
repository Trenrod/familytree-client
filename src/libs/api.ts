import { IPersonAPIEntry } from "../models/IPersonAPIEntry";
import PersonEntry from "../models/PersonEntry";
import Config from "./Config";
import { getPersonsFromServer } from "./ParserCSVToPerson";

const apiCallGetPerson = async function (id: number): Promise<PersonEntry | null> {
    try {
        const url = `${Config.SERVER_API_URL}/person/${id}`;
        const resultRaw = await fetch(url);
        const resultJson = await resultRaw.json();
        return new PersonEntry(resultJson);
    } catch (error) {
        throw error;
    }
};

const apiCallGetPersons = async function (): Promise<Map<number, PersonEntry>> {
    try {
        const url = `${Config.SERVER_API_URL}/person/?format=json`;
        const resultRaw = await fetch(url)
        const resultJson = await resultRaw.json();
        return getPersonsFromServer(resultJson);
    } catch (error) {
        throw error;
    }
};

const apiCallCreatePerson = async function (newPerson: IPersonAPIEntry): Promise<PersonEntry> {
    try {
        const url = `${Config.SERVER_API_URL}/person`
        const resultRaw = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newPerson)
        })
        return new PersonEntry(resultRaw);
    } catch (error) {
        throw error;
    }
}

const apiCallUpdatePerson = async function (newPerson: IPersonAPIEntry): Promise<PersonEntry> {
    try {
        const url = `${Config.SERVER_API_URL}/person/${newPerson.id}`
        const resultRaw = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newPerson)
        })
        return new PersonEntry(resultRaw);
    } catch (error) {
        throw error;
    }
}

const apiCallDeletePerson = async function (id: number): Promise<PersonEntry> {
    try {
        const url = `${Config.SERVER_API_URL}/person/${id}`
        const resultRaw = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        })
        return new PersonEntry(resultRaw);
    } catch (error) {
        throw error;
    }
}
export {
    apiCallGetPerson,
    apiCallGetPersons,
    apiCallUpdatePerson,
    apiCallCreatePerson,
    apiCallDeletePerson
};