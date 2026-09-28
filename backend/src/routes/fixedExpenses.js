import { Router } from 'express';
import {
  getFixedExpenses,
  createFixedExpense,
  updateFixedExpense,
  deleteFixedExpense,
  payFixedExpense,
} from '../controllers/fixedExpensesController.js';

const router = Router();

router.get('/', getFixedExpenses);
router.post('/', createFixedExpense);
router.put('/:id', updateFixedExpense);
router.delete('/:id', deleteFixedExpense);
router.post('/:id/pay', payFixedExpense);

export default router;