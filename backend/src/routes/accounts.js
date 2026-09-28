import { Router } from 'express';
import { getAccounts, createAccount, deleteAccount, addIncome } from '../controllers/accountsController.js';

const router = Router();

router.get('/', getAccounts);
router.post('/', createAccount);
router.delete('/:id', deleteAccount);
router.post('/:id/income', addIncome);

export default router;