import React from 'react';
import './App.css';
import FamilyTreeGraph from './components/FamilyTreeGraph';
// import { getPersonsFromCSV, getPersonsFromServer, getTreeGraphDataFromCSV, getTreeGraphDataFromServer } from './libs/ParserCSVToPerson';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import PersonEditPage from './pages/PersonEditPage';
import PersonUpdatePage from './pages/PersonUpdatePage';

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/create">
                    <PersonEditPage user={null}></PersonEditPage>
                </Route>
                <Route path="/edit/:personId">
                    <PersonUpdatePage></PersonUpdatePage>
                </Route>
                <Route path="/">
                    <FamilyTreeGraph width={5000} height={5000} />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
