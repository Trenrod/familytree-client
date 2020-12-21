import React, { useEffect, useState } from 'react';
import './App.css';
import { TreeGraphData, TreeGraphNodeData } from './models/TreeGraphNodeData';
import FamilyTreeGraph from './components/FamilyTreeGraph';
import { getPersonsFromCSV, getPersonsFromServer, getTreeGraphDataFromCSV, getTreeGraphDataFromServer } from './libs/ParserCSVToPerson';
import FormDialog from './modals/ModifyPerson';
import PersonEntry from './models/PersonEntry';
import CONFIG from './libs/Config'

function App() {
    const [dataset, setDataset] = useState<TreeGraphData>({
        links: [],
        nodes: []
    });

    const [personList, setPersonList] = useState<Map<number, PersonEntry>>(new Map());

    useEffect(() => {
        async function fetchData() {
            const newDataSet = await getTreeGraphDataFromServer("http://localhost:3080");
            setDataset(newDataSet);
            const persons = await getPersonsFromServer("http://localhost:3080");
            setPersonList(persons);
        }
        fetchData();
    }, []);

    return (
        <div>
            <FormDialog personData={personList}></FormDialog>
            <FamilyTreeGraph width={5000} height={5000} data={dataset} />
        </div>
    );
}

export default App;
