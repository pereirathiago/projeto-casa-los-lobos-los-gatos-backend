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
  monthlyAmount: yup
    .number()
    .required('Valor mensal é obrigatório')
    .min(0, 'Valor mensal deve ser maior ou igual a zero')
    .test('decimal', 'Valor mensal deve ter no máximo 2 casas decimais', (value) => {
      if (value === undefined) return true
      return /^\d+(\.\d{1,2})?$/.test(value.toString())
    }),
})

export const updateSponsorshipSchema = yup.object().shape({
  animalId: yup.string().uuid('ID do animal deve ser válido').optional(),
  monthlyAmount: yup
    .number()
    .min(0, 'Valor mensal deve ser maior ou igual a zero')
    .test('decimal', 'Valor mensal deve ter no máximo 2 casas decimais', (value) => {
      if (value === undefined) return true
      return /^\d+(\.\d{1,2})?$/.test(value.toString())
    })
    .optional(),
  active: yup.boolean().optional(),
})
