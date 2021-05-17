import React, { ReactElement, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import {
    useParams
} from "react-router-dom";
import { apiCallGetPerson, apiCallGetPersons, apiCallUpdatePerson } from "../libs/api";
import Config from "../libs/Config";
import { Logger } from "../libs/Logger";
import queryConstants from "../libs/queryConstants";
import { IPersonAPIEntry } from "../models/IPersonAPIEntry";
import PersonEntry from "../models/PersonEntry";
import PersonEditPage from "./PersonEditPage";

type PersonUpdatePageProps = {
}

export default function PersonUpdatePage(props: PersonUpdatePageProps): ReactElement {
    const [createPerson, setCreatePerson] = React.useState<IPersonAPIEntry | null>(null);

    const { personId } = useParams();
    const queryPerson = useQuery<PersonEntry | null, Error>([queryConstants.GET_PERSON, personId], () => apiCallGetPerson(personId));

    useEffect(() => {
        if (!queryPerson.isLoading && queryPerson.data) {
            const person: PersonEntry = queryPerson.data;
            setCreatePerson(person);
            Logger.info("User data received", person);
        }
    }, [queryPerson.isLoading, queryPerson.data, queryPerson.error]);

    let loadingState = "Loading";
    if (queryPerson.error) loadingState = queryPerson.error.message;

    return (
        <div>
            {(
                createPerson
                    ? <PersonEditPage user={createPerson}></PersonEditPage>
                    : <h1>Loading...</h1>
            )}
        </div>
    );
}