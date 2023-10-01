import { Request, Response } from 'express';
import { createOrUpdate, findUnique } from '../prismaFunctions/prisma';

const createCompany = async (req: Request, res: Response) => {
    const data = req.body;
    const userId = req.user?.id;
    const userType = req.user?.type;

    try {
        if (userType !== 'ceo') {
            return res.status(404).json({ mensagem: 'Você não pode executar esta funcionalidade' });
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
    const userId = req.user?.id;
    const userType = req.user?.type;

    try {
        if (userType !== 'ceo') {
            return res.status(404).json({ mensagem: 'Você não pode executar esta funcionalidade' });
        }

        const ceo = await findUnique('user', { id: userId });

        const company = await findUnique('company', { ceoId: ceo.id });

        await createOrUpdate('task', { ...data, companyId: company.id });

        return res.status(201).json({ mensagem: 'Tarefa criada com sucesso!' });
    } catch (error) {
        return res.status(500).json(error);
    }
}

const createExpense = async (req: Request, res: Response) => {
    const data = req.body;
    const userType = req.user?.type;

    try {
        if (userType !== 'ceo') {
            return res.status(404).json({ mensagem: 'Você não pode executar esta funcionalidade' });
        }

        await createOrUpdate('expense', { ...data });

        return res.status(201).json({ mensagem: 'Despesa criada com sucesso!' });
    } catch (error) {
        return res.status(500).json(error);
    }
}

export {
    createCompany,
    createTask,
    createExpense
}