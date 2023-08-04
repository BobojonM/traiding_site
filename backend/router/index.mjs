import Router from 'express';
import userController from '../controllers/user-controller.mjs';
import { body } from 'express-validator';
import authMiddleware from '../middlewares/auth-middleware.mjs';

const router = new Router();

router.post('/registration',
    body('email').isEmail(),
    userController.registerUser
);
router.post('/login', 
    body('email').isEmail(),
    userController.loginUser
);
router.post('/logout', userController.logoutUser);
router.get('/activate/:link', userController.activateUser);
router.get('/refresh', userController.refreshUser);
router.get('/users', authMiddleware, userController.getUsers);

export default router;
