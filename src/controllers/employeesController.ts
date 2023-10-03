import { Request, Response } from 'express';
import { createOrUpdate, findMany, findUnique } from '../prismaFunctions/prisma';

const applyForLoan = async (req: Request, res: Response) => {
    const data = req.body;
    const userId = req.user?.id;
    const userType = req.user?.type;

    try {
        if (userType !== 'employee') {
            return res.status(401).json({ mensagem: 'Você não pode executar esta funcionalidade' });
        }

        const employee = await findUnique('user', { id: userId });

        await createOrUpdate('loan', { ...data, employeeId: employee.id });

        return res.status(201).json({ mensagem: 'Empréstimo solicitado com sucesso!' });
    } catch (error) {
        return res.status(500).json(error);
    }
}

const showMandatoryExpenses = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const userType = req.user?.type;

    try {
        if (userType !== 'employee') {
            return res.status(401).json({ mensagem: 'Você não pode executar esta funcionalidade' });
        }

        const employee = await findUnique('user', { id: userId });

        const employeeExpenses = await findMany('employeeExpense', { employeeId: employee.id });

        let mandatoryExpenses: object[] = [];

        for (let registry of employeeExpenses) {
            let expense = await findUnique('expense', { id: registry.expenseId });
            if (expense.type) {
                mandatoryExpenses.push(expense);
            }
        }
        return res.status(200).json(mandatoryExpenses);
    } catch (error) {
        return res.status(500).json(error);
    }
}

const showOptionalExpenses = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const userType = req.user?.type;

    try {
        if (userType !== 'employee') {
            return res.status(401).json({ mensagem: 'Você não pode executar esta funcionalidade' });
        }

        const employee = await findUnique('user', { id: userId });

        const employeeExpenses = await findMany('employeeExpense', { employeeId: employee.id });

        let optionalExpenses: object[] = [];

        for (let registry of employeeExpenses) {
            let expense = await findUnique('expense', { id: registry.expenseId });
            if (!expense.type) {
                optionalExpenses.push(expense);
            }
        }
        return res.status(200).json(optionalExpenses);
    } catch (error) {
        return res.status(500).json(error);
    }
}

export {
    applyForLoan,
    showMandatoryExpenses,
    showOptionalExpenses
}