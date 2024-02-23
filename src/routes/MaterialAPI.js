import express from 'express';
import { materialController } from '../controller/MaterialController';

const router = express.Router();

const MaterialRouter = (app) => {
    router.get('/page/:page', materialController.getMaterialData);
    router.post('/', materialController.postMaterial);
    router.put('/', materialController.putMaterialController);
    router.put('/:id', materialController.putMaterialController);
    router.delete('/:id', materialController.deleteMaterialController);
    router.delete('/', materialController.deleteMaterialController);

    return app.use('/api/material', router);
}

export {
    MaterialRouter
}
