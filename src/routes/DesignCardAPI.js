import express from 'express';
import { getDesignCardById } from '../controller/DesignCardController';

const router = express.Router();

const DesignCardRouter = (app) => {
    router.get('/:id', getDesignCardById);

    return app.use('/design-card', router);
}

export {
    DesignCardRouter
}
