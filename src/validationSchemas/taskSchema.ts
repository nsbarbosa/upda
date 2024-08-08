import * as yup from 'yup';

export const taskValidationSchema = yup.object({
  title: yup
    .string()
    .required('Título é obrigatório')
    .max(150, 'Título deve ter no máximo 150 caracteres'),
  description: yup
    .string()
    .required('Descrição é obrigatória')
    .max(2000, 'Descrição deve ter no máximo 2000 caracteres'),
});
