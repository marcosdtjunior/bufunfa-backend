import { Router } from 'express';
import { register, login } from './controllers/usersController';
import { verifyLogin } from './middleware/verifyLogin';
import { createCompany, createExpense, createTask } from './controllers/ceosController';
import { applyForLoan } from './controllers/employeesController';

const router = Router();

router.post('/register/:userType', register);
router.post('/login/:userType', login);

router.use(verifyLogin);

//CEO routes
router.post('/createCompany', createCompany);
router.post('/createTask', createTask);
router.post('/createExpense', createExpense);

//Employee routes
router.post('/applyForLoan', applyForLoan);

export default router;