import '../env';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createOrUpdate, findUnique } from '../prismaFunctions/prisma';
import { requiredCeoData, requiredEmployeeData } from '../utils/validations';

const register = async (req: Request, res: Response) => {
    const { userType } = req.params;
    const user = req.body;

    try {
        const { cpf, ...userData } = user;
        const { email } = user;

        let validation;

        switch (userType) {
            case 'ceo':
                validation = requiredCeoData.safeParse(user);

                const findCPF = await findUnique('ceo', { cpf });
                if (findCPF) {
                    return res.status(400).json({ mensagem: 'Já existe um CEO com o CPF cadastrado' });
                }

                break;
            case 'employee':
                validation = requiredEmployeeData.safeParse(user);
                break;
            default:
                return res.status(400).json({ mensagem: 'Tipo de usuário inválido' });
        }

        if (!validation.success) {
            return res.status(400).json({ mensagem: validation.error.issues[0].message });
        }

        const findEmail = await findUnique('user', { email });

        if (findEmail) {
            return res.status(404).json({ mensagem: 'Já existe um usuário com o e-mail cadastrado' });
        }

        const encryptedPassword = await bcrypt.hash(user.password, 10);

        await createOrUpdate('user', {
            ...userData,
            password: encryptedPassword,
            type: userType
        });

        const userDataFound = await findUnique('user', { email });

        const userId = userDataFound.id;

        if (userType === 'ceo') {
            await createOrUpdate(userType, { userId, cpf });
        } else {
            await createOrUpdate(userType, { userId, balance: 0 });
        }

        return res.status(201).json({ mensagem: "Usuário criado com sucesso!" });
    } catch (error) {
        return res.status(500).json(error);
    }
}

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const userFound = await findUnique('user', { email });

        if (!userFound) {
            return res.status(404).json({ mensagem: 'Usuário e/ou senha inválido(s)' });
        }

        const passwordVerified = await bcrypt.compare(password, userFound.password);

        if (!passwordVerified) {
            return res.status(404).json({ mensagem: 'Usuário e/ou senha inválido(s)' });
        }

        const token = jwt.sign({ id: userFound.id }, process.env.JWT_SECRET ?? '', { expiresIn: '8h' });

        const { password: _, ...userData } = userFound;

        return res.status(201).json({
            user: userData,
            token
        });

    } catch (error) {
        return res.status(500).json(error);
    }
}

export {
    register,
    login
}