import * as yup from 'yup'

export const createSponsorSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters long'),
  email: yup.string().required('Email is required').email('Invalid email format'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters long'),
})

export const updateSponsorSchema = yup.object().shape({
  name: yup.string().optional().min(3, 'Name must be at least 3 characters long'),
  email: yup.string().optional().email('Invalid email format'),
  password: yup.string().optional().min(6, 'Password must be at least 6 characters long'),
})
