import { z, zodNonEmptyStringValidation } from "src/core/zod"

export const email = z
  .string()
  .email()
  .transform((str) => str.toLowerCase().trim())

export const password = z
  .string()
  .min(8)
  .max(100)
  .transform((str) => str.trim())

export const Signup = z.object({
  name: zodNonEmptyStringValidation,
  email,
  password,
  // used to set org id in custom script
  organizationId: z.number().int().positive(),
})

export const Login = z.object({
  email,
  password: z.string(),
})

export const ForgotPassword = z.object({
  email,
})

export const ResetPassword = z
  .object({
    password: password,
    passwordConfirmation: password,
    token: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"], // set the path of the error
  })

export const ChangePassword = z.object({
  currentPassword: z.string(),
  newPassword: password,
})
