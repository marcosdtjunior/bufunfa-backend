import { Request, Response } from 'express';
import { createOrUpdate, findUnique } from '../prismaFunctions/prisma';

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

export {
    applyForLoan
}