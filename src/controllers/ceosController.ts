import { Request, Response } from 'express';
import { createOrUpdate, findFirst, findMany, findUnique, maxIndex } from '../prismaFunctions/prisma';

const createCompany = async (req: Request, res: Response) => {
    const data = req.body;
    const userId = req.user?.id;
    const userType = req.user?.type;

    try {
        if (userType !== 'ceo') {
            return res.status(401).json({ mensagem: 'Você não pode executar esta funcionalidade' });
        }

        const findCNPJ = await findUnique('company', { cnpj: data.cnpj });

        if (findCNPJ) {
            return res.status(400).json({ mensagem: 'Já existe uma empresa com este CNPJ' });
        }

        const ceo = await findUnique('user', { id: userId });

        await createOrUpdate('company', { ...data, ceoId: ceo.id });

        return res.status(201).json({ mensagem: 'Empresa criada com sucesso!' });
    } catch (error) {
        return res.status(500).json(error);
    }
}

const createTask = async (req: Request, res: Response) => {
    const data = req.body;
    const { companyId } = req.params;
    const userId = req.user?.id;
    const userType = req.user?.type;

    try {
        if (userType !== 'ceo') {
            return res.status(401).json({ mensagem: 'Você não pode executar esta funcionalidade' });
        }

        const companyFound = await findUnique('company', { id: Number(companyId) });

        if (!companyFound) {
            return res.status(404).json({ mensagem: 'Empresa não encontrada!' });
        }

        const ceo = await findUnique('user', { id: userId });
        const companyCeo = await findFirst('company', { id: Number(companyId), ceoId: ceo.id });

        if (!companyCeo) {
            return res.status(401).json({ mensagem: 'O CEO logado não é CEO desta empresa!' });
        }

        await createOrUpdate('task', { ...data, companyId: Number(companyId) });

        const maxIdTask = await maxIndex('task');

        const companyEmployees = await findMany('employeeCompany', { companyId: Number(companyId) });

        if (companyEmployees) {
            for (let registry of companyEmployees) {
                await createOrUpdate('employeeTask', { employeeId: registry.employeeId, taskId: maxIdTask });
            }
        }

        return res.status(201).json({ mensagem: 'Tarefa criada com sucesso!' });
    } catch (error) {
        return res.status(500).json(error);
    }
}

const createExpense = async (req: Request, res: Response) => {
    const data = req.body;
    const { companyId } = req.params;
    const userId = req.user?.id;
    const userType = req.user?.type;

    try {
        if (userType !== 'ceo') {
            return res.status(401).json({ mensagem: 'Você não pode executar esta funcionalidade' });
        }

        const companyFound = await findUnique('company', { id: Number(companyId) });

        if (!companyFound) {
            return res.status(404).json({ mensagem: 'Empresa não encontrada!' });
        }

        const ceo = await findUnique('user', { id: userId });
        const companyCeo = await findFirst('company', { id: Number(companyId), ceoId: ceo.id });

        if (!companyCeo) {
            return res.status(401).json({ mensagem: 'O CEO logado não é CEO desta empresa!' });
        }

        await createOrUpdate('expense', { ...data, companyId: Number(companyId) });

        const maxIdExpense = await maxIndex('expense');

        const companyEmployees = await findMany('employeeCompany', { companyId: Number(companyId) });

        if (companyEmployees) {
            for (let registry of companyEmployees) {
                await createOrUpdate('employeeExpense', { employeeId: registry.employeeId, expenseId: maxIdExpense });
            }
        }

        return res.status(201).json({ mensagem: 'Despesa criada com sucesso!' });
    } catch (error) {
        return res.status(500).json(error);
    }
}

const hireEmployee = async (req: Request, res: Response) => {
    const { name } = req.body;
    const { companyId } = req.params;
    const userId = req.user?.id;
    const userType = req.user?.type;

    try {
        if (userType !== 'ceo') {
            return res.status(401).json({ mensagem: 'Você não pode executar esta funcionalidade' });
        }

        const userFound = await findFirst('user', { name });

        if (!userFound || userFound.type !== 'employee') {
            return res.status(404).json({ mensagem: 'Funcionário não encontrado' });
        }

        const companyFound = await findUnique('company', { id: Number(companyId) });

        if (!companyFound) {
            return res.status(404).json({ mensagem: 'Empresa não encontrada!' });
        }

        const ceo = await findUnique('user', { id: userId });
        const companyCeo = await findFirst('company', { id: Number(companyId), ceoId: ceo.id });

        if (!companyCeo) {
            return res.status(401).json({ mensagem: 'O CEO logado não é CEO desta empresa!' });
        }

        const companyEmployee = await findFirst('employeeCompany', { employeeId: userFound.id, companyId: Number(companyId) });

        if (companyEmployee) {
            return res.status(400).json({ mensagem: 'O funcionário já pertence a esta empresa!' });
        }

        await createOrUpdate('employeeCompany', { employeeId: userFound.id, companyId: Number(companyId), balance: 0 });

        const tasks = await findMany('task', { companyId: Number(companyId) });

        if (tasks) {
            for (let registry of tasks) {
                await createOrUpdate('employeeTask', { employeeId: userFound.id, taskId: registry.id });
            }
        }

        const expenses = await findMany('expense', { companyId: Number(companyId) });

        if (expenses) {
            for (let registry of expenses) {
                await createOrUpdate('employeeExpense', { employeeId: userFound.id, expenseId: registry.id });
            }
        }

        return res.status(201).json({ mensagem: 'Funcionário contratado com sucesso!' });
    } catch (error) {
        return res.status(500).json(error);
    }
}

const getAllEmployees = async (req: Request, res: Response) => {
    const userType = req.user?.type;

    try {
        if (userType !== 'ceo') {
            return res.status(401).json({ mensagem: 'Você não pode executar esta funcionalidade' });
        }

        const employeesFound = await findMany('user', { type: 'employee' });

        let employees: object[] = [];

        for (let employee of employeesFound) {
            employees.push({ id: employee.id, name: employee.name });
        }

        return res.status(200).json(employees);
    } catch (error) {
        return res.status(500).json(error);
    }
}

const getCompanyEmployees = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const userType = req.user?.type;
    const { companyId } = req.params;

    try {
        if (userType !== 'ceo') {
            return res.status(401).json({ mensagem: 'Você não pode executar esta funcionalidade' });
        }

        const companyFound = await findUnique('company', { id: Number(companyId) });

        if (!companyFound) {
            return res.status(404).json({ mensagem: 'Empresa não encontrada!' });
        }

        const ceo = await findUnique('user', { id: userId });
        const companyCeo = await findFirst('company', { id: Number(companyId), ceoId: ceo.id });

        if (!companyCeo) {
            return res.status(401).json({ mensagem: 'O CEO logado não é CEO desta empresa!' });
        }

        const companyEmployees = await findMany('employeeCompany', { companyId: Number(companyId) });

        let employees: object[] = [];

        for (let registry of companyEmployees) {
            let query = await findFirst('user', { id: registry.employeeId });
            employees.push({ id: query.id, name: query.name });
        }

        return res.status(200).json(employees);

    } catch (error) {
        return res.status(500).json(error);
    }
}

const getCeoCompanies = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const userType = req.user?.type;

    try {
        if (userType !== 'ceo') {
            return res.status(401).json({ mensagem: 'Você não pode executar esta funcionalidade' });
        }

        const ceo = await findUnique('user', { id: userId });
        const ceoCompanies = await findMany('company', { ceoId: ceo.id });

        return res.status(200).json(ceoCompanies);

    } catch (error) {
        return res.status(500).json(error);
    }
}

export {
    createCompany,
    createTask,
    createExpense,
    hireEmployee,
    getAllEmployees,
    getCompanyEmployees,
    getCeoCompanies
}