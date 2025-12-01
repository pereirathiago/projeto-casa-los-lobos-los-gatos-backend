import * as yup from 'yup'

export const createSponsorSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório').min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: yup.string().required('Email é obrigatório').email('Formato de email inválido'),
  password: yup
    .string()
    .required('Senha é obrigatória')
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

export const updateSponsorSchema = yup.object().shape({
  name: yup.string().optional().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: yup.string().optional().email('Formato de email inválido'),
  password: yup.string().optional().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})
