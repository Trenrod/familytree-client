require('dotenv').config();

import express from "express";
import swaggerUi from 'swagger-ui-express';
import { ConfigManager } from './libs/Configuration';
import personRoute from './routes/Person';
import PersistanceManager from "./libs/persistancemanager";
import bodyParser from "body-parser";
import cors from 'cors';
import rawSwaggerConfig from './restapi/swaggerconfig.json';

const port = process.env.PORT || "3080";

// Init config and persistance
const start = async () => {
    await ConfigManager.getInstance();
    await PersistanceManager.getInstance();

    const app = express();

    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));
    // app.use(express.static(path.join(__dirname, 'public')));
    app.use(bodyParser.json());

    const swaggerConfig = Object.assign({}, rawSwaggerConfig);
    swaggerConfig.host = `localhost:${port}`;
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));

    app.use('/person', personRoute);
    app.use('/marriage', personRoute);

    app.listen(port, () => {
        console.log(`Running at port ${port}`);
    });
}

start();