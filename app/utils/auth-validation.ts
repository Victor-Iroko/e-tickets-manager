import { z } from 'zod/mini'

export const loginSchema = z.object({
  email: z.string().check(z.email('Please enter a valid email address')),
  password: z
    .string()
    .check(z.minLength(8, 'Password must be at least 8 characters'))
})

export type LoginSchema = z.infer<typeof loginSchema>

export const signupSchema = z.object({
  name: z.string().check(z.minLength(2, 'Name must be at least 2 characters')),
  email: z.string().check(z.email('Please enter a valid email address')),
  password: z
    .string()
    .check(z.minLength(8, 'Password must be at least 8 characters'))
})

export type SignupSchema = z.infer<typeof signupSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().check(z.email('Please enter a valid email address'))
})

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .check(z.minLength(8, 'Password must be at least 8 characters')),
    confirmPassword: z
      .string()
      .check(z.minLength(8, 'Password must be at least 8 characters'))
  })
  .check(
    z.refine(
      (data) => data.password === data.confirmPassword,
      'Passwords do not match'
    )
  )

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>
