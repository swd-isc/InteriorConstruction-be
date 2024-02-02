import express from 'express';
import { getUserTest } from '../../controller/user-controller/UserController';

const router = express.Router();

const UserRouter = (app) => {
    router.get('/', getUserTest);

    return app.use('/user', router);
}

export {
    UserRouter
}