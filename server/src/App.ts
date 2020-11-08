require('dotenv').config();

import express from "express";
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';
import { ConfigManager } from './libs/Configuration';
import personRoute from './routes/Person';
import PersistanceManager from "./libs/persistancemanager";

// Init config and persistance
const start = async () => {
    await ConfigManager.getInstance();
    await PersistanceManager.getInstance();

    const app = express();

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.use('/person', personRoute);

    app.listen(3000, () => {
        console.log("Running at port 3000");
    });
}

start();