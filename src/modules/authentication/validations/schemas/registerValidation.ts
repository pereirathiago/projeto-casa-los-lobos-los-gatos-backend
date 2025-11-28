import * as yup from 'yup'

export const registerUserSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters long'),
  email: yup.string().required('Email is required').email('Invalid email format').lowercase(),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters long'),
})
