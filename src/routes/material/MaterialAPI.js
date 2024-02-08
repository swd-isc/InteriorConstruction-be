import express from 'express';
import { getMaterialData } from '../../controller/material-controller/MaterialController';

const router = express.Router();

const MaterialRouter = (app) => {
    router.get('/page/:page', getMaterialData);

    return app.use('/material', router);
}

export {
    MaterialRouter
}
