import { z } from 'zod';

const employeeData = z.object({
    name: z.string()
        .nonempty({ message: 'Nome do usuário não pode ser vazio' }),
    email: z.string()
        .email({ message: 'Endereço de e-mail inválido' }),
    password: z.string()
        .regex(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
            { message: 'A senha precisa ter no mínimo 8 caracteres com pelo menos uma letra maiúscula e um número' })
});

const ceoData = z.object({
    name: z.string()
        .nonempty({ message: 'Nome do usuário não pode ser vazio' }),
    email: z.string()
        .email({ message: 'Endereço de e-mail inválido' }),
    password: z.string()
        .regex(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
            { message: 'A senha precisa ter no mínimo 8 caracteres com pelo menos uma letra maiúscula e um número' }),
    cpf: z.string({ required_error: "CPF é obrigatório" })
        .nonempty({ message: 'CPF não pode ser vazio' })
});

const requiredEmployeeData = employeeData.required();

const requiredCeoData = ceoData.required();

export {
    requiredCeoData,
    requiredEmployeeData
}