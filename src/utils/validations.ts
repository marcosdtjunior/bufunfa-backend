import { z } from 'zod';

const userValidationData = z.object({
    name: z.string()
        .min(1, { message: 'Nome do usuário não pode ser vazio' }),
    email: z.string()
        .email({ message: 'Endereço de e-mail inválido' }),
    password: z.string()
        .regex(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
            { message: 'A senha precisa ter no mínimo 8 caracteres com pelo menos uma letra maiúscula e um número' }),
    cpf: z.string()
        .min(1, { message: 'CPF não pode ser vazio' })
        .regex(/^[0-9]{3}[\.][0-9]{3}[\.][0-9]{3}[-][0-9]{2}$/,
            { message: 'O CPF precisa estar no seguinte padrão: XXX.XXX.XXX-XX' })
});

const requiredData = userValidationData.required();

export default requiredData;