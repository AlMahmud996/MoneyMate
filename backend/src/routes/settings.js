import { Router } from 'express';
import {
  resetBalances,
  resetAccounts,
  resetCategories,
  resetFixedExpenses,
  resetMonthExpenses,
  resetAll,
} from '../controllers/settingsController.js';

const router = Router();

router.post('/reset-balances', resetBalances);
router.post('/reset-accounts', resetAccounts);
router.post('/reset-categories', resetCategories);
router.post('/reset-fixed-expenses', resetFixedExpenses);
router.post('/reset-month-expenses', resetMonthExpenses);
router.post('/reset-all', resetAll);

export default router;