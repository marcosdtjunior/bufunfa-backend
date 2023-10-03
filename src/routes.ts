import { Router } from 'express';
import { register, login } from './controllers/usersController';
import { verifyLogin } from './middleware/verifyLogin';
import { createCompany, createExpense, createTask, getCeoCompanies, getAllEmployees, hireEmployee, getCompanyEmployees } from './controllers/ceosController';
import { applyForLoan, showMandatoryExpenses, showOptionalExpenses } from './controllers/employeesController';

const router = Router();

router.post('/register/:userType', register);
router.post('/login/:userType', login);

router.use(verifyLogin);

//CEO routes
router.post('/createCompany', createCompany);
router.post('/createTask/:companyId', createTask);
router.post('/createExpense/:companyId', createExpense);
router.post('/hireEmployee/:companyId', hireEmployee);
router.get('/getAllEmployees', getAllEmployees);
router.get('/getCompanyEmployees/:companyId', getCompanyEmployees);
router.get('/getCeoCompanies', getCeoCompanies);

//Employee routes
router.post('/applyForLoan', applyForLoan);
router.get('/showMandatoryExpenses', showMandatoryExpenses);
router.get('/showOptionalExpenses', showOptionalExpenses);

export default router;