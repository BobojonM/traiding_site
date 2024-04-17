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
router.put('/rules/connection/:id', rulesController.changeConnectionStatus);

// Singals for rules
router.get('/rules/signals/:name/:timeframe', rulesController.getSignalsForRule);

// Signals for timeframe and pair
router.get('/timeframes/signals/:timeframe/:pair', rulesController.getSignalsForTimframes)

// Get Trends
router.get('/trends/:timeframe', rulesController.getTrendsByTimeframe); 
router.post('/trends/signals', rulesController.getSignalsForTrends);

// Get Connections
router.get('/connections/:timeframe/:type', rulesController.getConnections);
router.get('/connections/:istop/:timeframe/:pair', rulesController.getTopConnections);

// Get Trading Pairs
router.get('/tradingpairs/', rulesController.getTradingPairs);
router.get('/tradingpairs/top/', rulesController.getTopTradingPairs);
router.get('/tradingpairs/trends/:param/:timeframe', rulesController.getPairsForTrends);

// Settings
router.get('/settings/levarages/', rulesController.getLevarages);
router.get('/settings/options/', rulesController.getOptions);
router.put('/settings/options/update/', rulesController.updateOption);

// Dumps/Pumps New 
router.get('/dumps/dates', rulesController.dumpsGetPreviousDates);
router.get('/dumps/dates/:id', rulesController.getDumpDataForDate);
router.get('/dumps/dates/time/:date', rulesController.getFourHoursForDate);
router.get('/dumps/time/:id', rulesController.getDumpForHours);


export default router;
