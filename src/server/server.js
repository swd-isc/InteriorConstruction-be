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
import { FurnitureCategoryRouter, FurnitureRouter, ShopRouter } from '../routes/FurnitureAPI';
import { ClassificationRouter } from '../routes/ClassificationAPI';
import { ReturnPolicyRouter } from '../routes/ReturnPolicyAPI';
import { DeliveryRouter } from '../routes/DeliveryAPI';
import { DesignCardRouter } from '../routes/DesignCardAPI';
import { AuthenRouter } from '../routes/AuthenAPI';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

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

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Interior Construction API Documents',
            version: '1.0.0'
        },
        servers: [
            {
                url: 'https://kietpt.vn/'
            }
        ]
    },
    apis: [
        './src/server/server.js'
    ]
}

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

/**
 * @swagger
 * /:
 *  get:
 *      summary: Abc ne
 *      description: This is description
 *      responses:
 *          200:
 *              description: This is 200 description
 *          400:
 *              description: This is 400 description
 */

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

//Shop routes
ShopRouter(app);

//Furniture routes
FurnitureRouter(app);

//Furniture category routes
FurnitureCategoryRouter(app);

//Classification routes
ClassificationRouter(app);

//ReturnPolicy routes
ReturnPolicyRouter(app);

//Delivery routes
DeliveryRouter(app);

//DesignCard routes
DesignCardRouter(app);

AuthenRouter(app);

app.get('/', (req, res) => {
    res.end(`Hello kiet`);
});

const port = process.env.PORT || 8888;

app.listen(port, () => {
    console.log('Server is running on port: ', port);
})

module.exports = app;
