import express from 'express';
import { getMaterialData, postMaterial, putMaterialController } from '../controller/MaterialController';

const router = express.Router();

const MaterialRouter = (app) => {
    router.get('/page/:page', getMaterialData);
    router.post('/', postMaterial);
    router.put('/', putMaterialController);
    router.put('/:id', putMaterialController);

    return app.use('/api/material', router);
}

export {
    MaterialRouter
}
