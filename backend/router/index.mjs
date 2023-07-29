import Router from 'express';
import userController from '../controllers/user-controller.mjs';

const router = new Router();

router.post('/registration', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);
router.get('/activate/:link', userController.activateUser);
router.get('/refresh', userController.refreshUser);
router.get('/users', userController.getUsers);

export default router;
