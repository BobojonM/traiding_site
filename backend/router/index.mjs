import Router from 'express';
import userController from '../controllers/user-controller.mjs';
import { body } from 'express-validator';
import authMiddleware from '../middlewares/auth-middleware.mjs';
import rulesController from '../controllers/rules-controller.mjs';

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

// Rules router
router.get('/rules/', rulesController.getAllRules);
router.get('/rules/:cat', rulesController.getAllRulesForCat);
router.post('/rules/create', rulesController.createRule);
router.put('/rules/status/:id', rulesController.changeStatus);

// Singals for rules
router.get('/rules/signals/:name', rulesController.getSignalsForRule);

// Get Trends
router.get('/trends/:timeframe', rulesController.getTrendsByTimeframe); 
router.post('/trends/signals', rulesController.getSignalsForTrends);

// Get Connections
router.get('/connections/:timeframe/:type', rulesController.getConnections);

// Get Trading Pairs
router.get('/tradingpairs/', rulesController.getTradingPairs);
router.get('/tradingpairs/top/', rulesController.getTopTradingPairs);

// Settings
router.get('/settings/levarages/', rulesController.getLevarages);
router.get('/settings/options/', rulesController.getOptions);
router.put('/settings/options/update/', rulesController.updateOption);


export default router;
