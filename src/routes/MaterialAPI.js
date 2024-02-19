import express from 'express';
import { getMaterialData, postMaterial } from '../controller/MaterialController';

const router = express.Router();

const MaterialRouter = (app) => {
    router.get('/page/:page', getMaterialData);
    router.post('/', postMaterial);

    return app.use('/api/material', router);
}

export {
    MaterialRouter
}
