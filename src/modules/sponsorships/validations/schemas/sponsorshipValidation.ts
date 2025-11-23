import * as yup from 'yup'

export const createSponsorshipSchema = yup.object().shape({
  userId: yup
    .string()
    .required('ID do usuário é obrigatório')
    .uuid('ID do usuário deve ser válido'),
  animalId: yup
    .string()
    .required('ID do animal é obrigatório')
    .uuid('ID do animal deve ser válido'),
})
