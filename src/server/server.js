import dotenv from 'dotenv';
import { configENV } from '../config/configENV';
import express from 'express';
import { configLog } from '../config/configLogServer';
import { configStaticFiles } from '../config/configStaticFiles';
import { UserRouter } from '../routes/user/UserAPI';
import { configBodyParse } from '../config/configBodyParse';
import { configCORS } from '../config/configCORS';
import { ColorRouter } from '../routes/color/ColorAPI';
import { MaterialRouter } from '../routes/material/MaterialAPI';
import { FurnitureRouter } from '../routes/furniture/FurnitureAPI';
import { ClassificationRouter } from '../routes/classification/ClassificationAPI';
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

//User routes
UserRouter(app);

//Color routes
ColorRouter(app);

//Material routes
MaterialRouter(app);

//Furniture routes
FurnitureRouter(app);

//Classification routes
ClassificationRouter(app);

const port = process.env.PORT || 8888;

app.listen(port, () => {
    console.log('Server is running on port: ', port);
})
