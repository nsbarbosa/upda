import * as yup from 'yup';

export const loginValidationSchema = yup.object({
  email: yup
    .string()
    .email('Formato de email inválido')
    .required('Email é obrigatório')
    .max(150, 'Email deve ter no máximo 150 caracteres'),
  password: yup
    .string()
    .required('Senha é obrigatória')
    .max(10, 'Senha deve ter no máximo 10 caracteres'),
});
