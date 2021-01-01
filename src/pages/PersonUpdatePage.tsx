import React, { ReactElement, useEffect } from "react";
import {
    useParams
} from "react-router-dom";
import Config from "../libs/Config";
import { useFindUserByIdQuery, UserFieldsFragment } from "../libs/generated/graphql";
import { IPersonEntry } from "../models/IPersonEntry";
import PersonEditPage from "./PersonEditPage";

type PersonUpdatePageProps = {
}

export default function PersonUpdatePage(props: PersonUpdatePageProps): ReactElement {
    const { personId } = useParams();

    const user = useFindUserByIdQuery(Config.USE_QUERY_INIT, { id: personId });
    const [createPerson, setCreatePerson] = React.useState<IPersonEntry | null>(null);

    useEffect(() => {
        if (user.isSuccess && user.data) {
            const userData: UserFieldsFragment = user.data.findUserById;
            setCreatePerson({
                id: parseInt(userData.id),
                forename: userData.forename,
                lastname: userData.lastname,
                marriages: userData.marriages ? userData.marriages.map(val => parseInt(val.id)) : [],
                parents: userData.parents ? userData.parents.map(val => parseInt(val.id)) : [],
                children: userData.children ? userData.children.map(val => parseInt(val.id)) : []
            });
        }
    }, [user]);

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