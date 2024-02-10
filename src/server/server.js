import dotenv from 'dotenv';
import { configENV } from '../config/configENV';
import express from 'express';
import { configLog } from '../config/configLogServer';
import { configStaticFiles } from '../config/configStaticFiles';
import { configBodyParse } from '../config/configBodyParse';
import { configCORS } from '../config/configCORS';

import { AccountRouter } from '../routes/AccountAPI';
import { ClientRouter } from '../routes/ClientAPI';
import { ContractRouter } from '../routes/ContractAPI';
import { DesignRouter } from '../routes/DesignAPI';
import { ColorRouter } from '../routes/ColorAPI';
import { MaterialRouter } from '../routes/MaterialAPI';
import { FurnitureRouter } from '../routes/FurnitureAPI';
import { ClassificationRouter } from '../routes/ClassificationAPI';
const app = express();

//Config .env
configENV(dotenv);

//Config check log server
configLog(app);

//Config CORS
configCORS(app);

//Config body parser
configBodyParse(app);

//Config static files
configStaticFiles(app);

//Account routes
AccountRouter(app);

//Client routes
ClientRouter(app);

//Contract routes
ContractRouter(app);

//Design routes
DesignRouter(app);

//Color routes
ColorRouter(app);

//Material routes
MaterialRouter(app);

//Furniture routes
FurnitureRouter(app);

//Classification routes
ClassificationRouter(app);

app.get('/', (req, res) => {
    res.end(`Hello kiet`);
});

const port = process.env.PORT || 8888;

app.listen(port, () => {
    console.log('Server is running on port: ', port);
})

module.exports = app;
