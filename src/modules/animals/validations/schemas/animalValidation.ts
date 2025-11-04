import * as yup from 'yup'

const tagSchema = yup.object().shape({
  id: yup.string().required('Tag id é obrigatório'),
  label: yup.string().required('Tag label é obrigatório'),
  color: yup
    .string()
    .required('Tag color é obrigatório')
    .matches(/^#[0-9A-Fa-f]{6}$/, 'Color deve estar no formato hexadecimal (#RRGGBB)'),
})

export const createAnimalSchema = yup.object().shape({
  name: yup.string().required('Nome do animal é obrigatório'),
  type: yup
    .string()
    .required('Tipo do animal é obrigatório')
    .oneOf(['dog', 'cat'], 'Tipo deve ser "dog" ou "cat"'),
  breed: yup.string().required('Raça do animal é obrigatória'),
  age: yup
    .number()
    .required('Idade do animal é obrigatória')
    .min(0, 'Idade deve ser maior ou igual a 0')
    .max(30, 'Idade deve ser menor ou igual a 30'),
  description: yup
    .string()
    .required('Descrição do animal é obrigatória')
    .min(20, 'Descrição deve ter no mínimo 20 caracteres'),
  tags: yup.array().of(tagSchema).optional(),
})

export const updateAnimalSchema = yup.object().shape({
  name: yup.string().optional(),
  type: yup.string().optional().oneOf(['dog', 'cat'], 'Tipo deve ser "dog" ou "cat"'),
  breed: yup.string().optional(),
  age: yup
    .number()
    .optional()
    .min(0, 'Idade deve ser maior ou igual a 0')
    .max(30, 'Idade deve ser menor ou igual a 30'),
  description: yup.string().optional().min(20, 'Descrição deve ter no mínimo 20 caracteres'),
  tags: yup.array().of(tagSchema).optional(),
})
