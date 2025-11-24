import * as yup from 'yup'

export const createDonationSchema = yup.object().shape({
  amount: yup
    .number()
    .required('Valor é obrigatório')
    .positive('Valor deve ser positivo')
    .typeError('Valor deve ser um número'),
  donationDate: yup
    .date()
    .required('Data da doação é obrigatória')
    .typeError('Data da doação inválida'),
  notes: yup.string().optional(),
})
