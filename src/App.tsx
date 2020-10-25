import React, { useEffect, useState } from 'react';
import './App.css';
import { TreeGraphData, TreeGraphNodeData } from './models/TreeGraphNodeData';
import FamilyTreeGraph from './components/FamilyTreeGraph';
import {getPersonsFromCSV, getTreeGraphDataFromCSV} from './libs/ParserCSVToPerson';
import FormDialog from './modals/ModifyPerson';
import PersonEntry from './models/PersonEntry';
import D3test from './components/D3test';

function App() {
    const [dataset, setDataset] = useState<TreeGraphData>({
        links: [],
        nodes: []
    });

    const [personList, setPersonList] = useState<PersonEntry[]>([]);

    useEffect(() => {
        async function fetchData() {
            const newDataSet = await getTreeGraphDataFromCSV();
            setDataset(newDataSet);
            const persons = await getPersonsFromCSV();
            setPersonList(persons);
        }
        fetchData();
    }, []);

    return (
        <div>
            {dataset.nodes.length > 0
                ?<FormDialog personData={personList}></FormDialog>
                :null
            }
            {/* <D3test wid5h={500} heig5t={500} data={[10, 5, 20, 15]}></D3test> */}
            <FamilyTreeGraph width={5000} height={5000} data={dataset} />
        </div>
    );
}

export default App;
