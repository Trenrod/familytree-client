import { useQuery } from "@apollo/client";
import React, { ReactElement, useEffect } from "react";
import {
    useParams
} from "react-router-dom";
import Config from "../libs/Config";
import { FindUserByIdDocument, UserFieldsFragment } from "../libs/generated/graphql";
import { Logger } from "../libs/Logger";
import { IPersonEntry } from "../models/IPersonEntry";
import PersonEditPage from "./PersonEditPage";

type PersonUpdatePageProps = {
}

export default function PersonUpdatePage(props: PersonUpdatePageProps): ReactElement {
    const { personId } = useParams();

    const user = useQuery(FindUserByIdDocument, {
        variables: {
            id: personId
        },
        fetchPolicy: "no-cache"
    });
    const [createPerson, setCreatePerson] = React.useState<IPersonEntry | null>(null);

    useEffect(() => {
        if (!user.loading && user.data) {
            const userData: UserFieldsFragment = user.data.findUserById;
            setCreatePerson({
                id: parseInt(userData.id),
                forename: userData.forename,
                lastname: userData.lastname,
                avatar: userData.avatar,
                bio: userData.bio,
                birthName: userData.birthname,
                birthdate: userData.birthdate,
                dayOfDeath: userData.dayOfDeath,
                marriages: userData.marriages ? userData.marriages.map(val => parseInt(val.id)) : [],
                marriagesWithUsers: userData.marriagesWithUsers ? userData.marriagesWithUsers.map(val => parseInt(val.id)) : [],
                parents: userData.parents ? userData.parents.map(val => parseInt(val.id)) : [],
                children: userData.children ? userData.children.map(val => parseInt(val.id)) : []
            });
            Logger.info("User data received", userData);
        }
    }, [user.loading]);

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