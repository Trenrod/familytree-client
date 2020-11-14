import React, { useEffect, useState } from 'react';
import './App.css';
import { TreeGraphData, TreeGraphNodeData } from './models/TreeGraphNodeData';
import FamilyTreeGraph from './components/FamilyTreeGraph';
import { getPersonsFromCSV, getTreeGraphDataFromCSV, getTreeGraphDataFromServer } from './libs/ParserCSVToPerson';
import FormDialog from './modals/ModifyPerson';
import PersonEntry from './models/PersonEntry';

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
                ? <FormDialog personData={personList}></FormDialog>
                : null
            }
            <FamilyTreeGraph width={5000} height={5000} data={dataset} />
        </div>
    );
}

export default App;
