import PersonEntry from '../models/PersonEntry';
import { TreeGraphNodeData, TreeGraphLinkData, TreeGraphData } from '../models/TreeGraphNodeData';
import Axios from 'axios';
import * as csv from 'fast-csv';

export async function getPersonsFromCSV() {
    const result = await Axios.get('/tree.csv');
    const peoples: Map<number, PersonEntry> = new Map();

    const parserPromise = new Promise<Map<number, PersonEntry>>((resolve, reject) => {
        csv.parseString(result.data, { headers: true })
            .on('error', (error) => reject(error))
            .on('data', (row) => {
                peoples.set(parseInt(row.id), new PersonEntry(row));
            })
            .on('end', () => {
                resolve(peoples);
            });
    });
    return parserPromise;
}

export async function getPersonsFromServer(hostUrl: string): Promise<Map<number, PersonEntry> | null> {
    try {
        const result = await Axios.get(`${hostUrl}/person/all`);
        const peopleMap: Map<number, PersonEntry> = new Map<number, PersonEntry>();
        result.data.forEach(element => {
            const person = new PersonEntry(element);
            peopleMap.set(person.id, person);
        });
        return peopleMap;
    } catch (error) {
        console.error(error);
    }
    return null;
}

export async function getTreeGraphDataFromServer(hostUrl: string): Promise<TreeGraphData | null> {
    try {
        const result = await Axios.get(`${hostUrl}/person/all`);
        const peoples: PersonEntry[] = [];
        result.data.forEach(element => {
            peoples.push(new PersonEntry(element));
        });
        return parsePeopleToTreeGraphData(peoples);
    } catch (error) {
        console.error(error);
    }
    return null;
}

const parsePeopleToTreeGraphData = function (peoples: PersonEntry[]): TreeGraphData {
    console.log('Creating tree');
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
        if (people.marriedToId && people.marriedToId.length > 0) {
            // If already with partner
            const existingNodeId = mapPeopleNode.get(people.id);
            if (!existingNodeId) {
                mapPeopleNode.set(people.id, newNodeId);
            }

            for (let mIdx = 0; mIdx < people.marriedToId.length; mIdx++) {
                mapPeopleNode.set(people.marriedToId[mIdx], existingNodeId ? existingNodeId : newNodeId);
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
        const fatherNodeId = mapPeopleNode.get(people.fatherId);
        const motherNodeId = mapPeopleNode.get(people.motherId);
        const sourceNodeId = mapPeopleNode.get(people.id);
        const targetNodeId = fatherNodeId != null ? fatherNodeId : motherNodeId;

        if (sourceNodeId != null && targetNodeId != null) {
            links.push({
                source: sourceNodeId,
                target: targetNodeId
            });
        }
    });

    return {
        links: links,
        nodes: nodes
    };
}

export async function getTreeGraphDataFromCSV() {
    const result = await Axios.get('/tree.csv');
    const peoples: PersonEntry[] = [];

    const parserPromise = new Promise<TreeGraphData>((resolve, reject) => {
        csv.parseString(result.data, { headers: true })
            .on('error', (error) => reject(error))
            .on('data', (row) => {
                peoples.push(new PersonEntry(row));
            })
            .on('end', () => {
                resolve(parsePeopleToTreeGraphData(peoples));
            });
    });
    return await parserPromise;
}