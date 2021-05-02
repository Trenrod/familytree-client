import PersonEntry from '../models/PersonEntry';
import { TreeGraphNodeData, TreeGraphLinkData, TreeGraphData } from '../models/TreeGraphNodeData';
import Axios from 'axios';
import * as csv from 'fast-csv';
import { AllUsersQuery, Marriage, MarriageFieldsFragment, User, UserFieldsFragment } from './generated/graphql';
import { link } from 'fs';

export async function getPersonsFromServer(users: UserFieldsFragment[]): Promise<Map<number, PersonEntry> | null> {
    try {
        const peopleMap: Map<number, PersonEntry> = new Map<number, PersonEntry>();
        users.forEach((user: UserFieldsFragment) => {
            const person = new PersonEntry(user);
            peopleMap.set(person.id, person);
        });
        return peopleMap;
    } catch (error) {
        console.error(error);
    }
    return null;
}

export async function getTreeGraphDataFromServer(users: UserFieldsFragment[], marriages: MarriageFieldsFragment[]): Promise<TreeGraphData | null> {
    try {
        const marriageMap = new Map<string, number[]>();
        marriages.forEach((marriage: MarriageFieldsFragment) => {
            marriageMap.set(marriage.id, marriage.users.map((user) => parseInt(user.id)));
        });

        const peoples: PersonEntry[] = [];
        users.forEach((user: UserFieldsFragment) => {
            let newUserObj: any = Object.assign({}, user);
            const userIds = [];
            for (const marriage of user.marriages) {
                const tmpUserIds = marriageMap.get(marriage.id).map((userid) => userid);
                tmpUserIds.forEach(userId => {
                    if (userId !== parseInt(user.id)) {
                        userIds.push({ id: userId });
                    }
                });
            }

            newUserObj = Object.assign(newUserObj, {
                marriages: userIds
            });
            peoples.push(new PersonEntry(newUserObj));
        });
        return parsePeopleToTreeGraphData(peoples);
    } catch (error) {
        console.error(error);
    }
    return null;
}

const parsePeopleToTreeGraphData = function (peoples: PersonEntry[]): TreeGraphData {
    // Create linked tree
    const nodes: TreeGraphNodeData[] = [];
    const links: TreeGraphLinkData[] = [];

    // Create lookup map between peopleID and people
    const mapIdPeople: Map<number, PersonEntry> = new Map();
    peoples.forEach((people: PersonEntry) => {
        mapIdPeople.set(people.id, people);
    });

    // Create lookup map for peopleId and the nodeId
    const mapPeopleNode: Map<number, number> = new Map();
    // Final map nodeId and node
    const nodesMap: Map<number, TreeGraphNodeData> = new Map();

    // Create nodes
    let nodeId = 0;
    peoples.forEach((people: PersonEntry) => {
        // check if there is already someone who is married with this person
        const newNodeId = nodeId++;
        if (people.marriages && people.marriages.length > 0) {
            // If already with partner
            const existingNodeId = mapPeopleNode.get(people.id);
            if (!existingNodeId) {
                mapPeopleNode.set(people.id, newNodeId);
            }

            for (let mIdx = 0; mIdx < people.marriages.length; mIdx++) {
                mapPeopleNode.set(people.marriages[mIdx], existingNodeId ? existingNodeId : newNodeId);
            }
        } else {
            mapPeopleNode.set(people.id, newNodeId);
        }
    });

    // Create nodes from map
    mapPeopleNode.forEach((nodeId: number, peopleId: number) => {
        const nodeData: TreeGraphNodeData = nodesMap.get(nodeId);
        if (nodeData) {
            nodeData.data.push(mapIdPeople.get(peopleId));
            nodesMap.set(nodeId, nodeData);
        } else {
            nodesMap.set(nodeId, {
                id: nodeId,
                data: [mapIdPeople.get(peopleId)]
            });
        }
    });

    // Add map to nodes
    nodesMap.forEach((nodedata: TreeGraphNodeData) => {
        nodes.push(nodedata);
    });

    // Create links
    peoples.forEach((people: PersonEntry) => {
        people.children.forEach((child) => {
            links.push({
                source: mapPeopleNode.get(child),
                target: mapPeopleNode.get(people.id)
            })
        })

        people.parents.forEach((parent) => {
            links.push({
                target: mapPeopleNode.get(parent),
                source: mapPeopleNode.get(people.id)
            })
        })
    });

    return {
        links: links,
        nodes: nodes
    };
}
