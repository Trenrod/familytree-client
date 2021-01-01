import { person, FTError } from './Api'
import axios from 'axios';

const API_URL = "http://localhost:3080"

describe('Person', () => {
    test('Create person', async () => {
        const data: person.PersonCreate.RequestBody = {
            avatar: false,
            forename: "Albert",
            lastname: "Dorn"
        };
        let resp;
        try {
            resp = await axios.post<person.PersonCreate.RequestBody, person.PersonCreate.ResponseBody | FTError>(`${API_URL}/person`, data);
            if (isPerson(resp)) {

            }
        } catch (error) {
            console.log(error);
        }
        console.log({ test: resp });
        // expect(resp.status).toBe(200);
    });
});
