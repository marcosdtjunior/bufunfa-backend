import { Router } from 'express';
import { register, login, getUserInfo } from './controllers/usersController';
import { verifyLogin } from './middleware/verifyLogin';
import { createCompany, createExpense, createTask, getCeoCompanies, getAllEmployees, hireEmployee, getCompanyEmployees } from './controllers/ceosController';
import { applyForLoan, showMandatoryExpenses, showOptionalExpenses } from './controllers/employeesController';

const router = Router();

function asyncHandler(fn: any) {
    return (req: any, res: any, next: any) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

router.post('/register/:userType', asyncHandler(register));
router.post('/login/:userType', asyncHandler(login));

router.use(asyncHandler(verifyLogin));

router.get('/userInfo', asyncHandler(getUserInfo));

//CEO routes
router.post('/createCompany', asyncHandler(createCompany));
router.post('/createTask/:companyId', asyncHandler(createTask));
router.post('/createExpense/:companyId', asyncHandler(createExpense));
router.post('/hireEmployee/:companyId', asyncHandler(hireEmployee));
router.get('/getAllEmployees', asyncHandler(getAllEmployees));
router.get('/getCompanyEmployees/:companyId', asyncHandler(getCompanyEmployees));
router.get('/getCeoCompanies', asyncHandler(getCeoCompanies));

//Employee routes
router.post('/applyForLoan', asyncHandler(applyForLoan));
router.get('/showMandatoryExpenses', asyncHandler(showMandatoryExpenses));
router.get('/showOptionalExpenses', asyncHandler(showOptionalExpenses));

export default router;