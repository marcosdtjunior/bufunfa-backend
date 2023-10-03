import { z } from 'zod';

const userValidationData = z.object({
    name: z.string()
        .nonempty({ message: 'Nome do usuário não pode ser vazio' }),
    email: z.string()
        .email({ message: 'Endereço de e-mail inválido' }),
    password: z.string()
        .regex(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
            { message: 'A senha precisa ter no mínimo 8 caracteres com pelo menos uma letra maiúscula e um número' })
});

const requiredData = userValidationData.required();

export default requiredData;