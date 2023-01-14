import { getSocket } from '@/api'
import { FormInput, Form, FormControl, Button } from '@/components'
import FormErrorMessage from '@/components/Forms/ErrorMessage'
import { FormPasswordInput } from '@/components/Forms/PasswordInput'
import { RootState } from '@/store'
import { setAuth } from '@/store/slices/auth'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { z } from 'zod'
import { useRegisterMutation } from '../../api'

type FormFields = {
  username: string
  email: string
  password: string
  passwordConfirmation: string
}

const ValidationSchema = z
  .object({
    username: z.string().min(1, { message: 'Username is required' }),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Valid email required' }),
    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .superRefine((password, ctx) => {
        const issues = {
          charCount: {
            achieved: password?.length >= 8,
            suggestion: 'Password must be at least 8 characters long',
          },
          uppercase: {
            achieved: /[A-Z]+/.test(password),
            suggestion: 'Password must contain at least 1 uppercase',
          },
          lowercase: {
            achieved: /[a-z]+/.test(password),
            suggestion: 'Password must contain at least 1 lowercase',
          },
          number: {
            achieved: /[0-9]+/.test(password),
            suggestion: 'Password must contain at least 1 number',
          },
          symbol: {
            achieved: /[~!@#$£%^&*]+/.test(password),
            suggestion: 'Special character required (~!@#$£%^&*)',
          },
        }

        const output = Object.values(issues)
        if (output.some((i) => !i.achieved)) {
          const suggestion = output.find((i) => !i.achieved)?.suggestion
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: suggestion ?? 'Password is invalid',
          })
        }
      }),
    passwordConfirmation: z.string().min(1, { message: 'Confirmation is required' }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  })

export const RegisterPage = (): JSX.Element => {
  const dispatch = useDispatch()
  const location = useLocation()

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  const [registerMutation, { isLoading: isRegistering }] = useRegisterMutation()

  const handleSubmit = async (data: FormFields) => {
    await registerMutation({
      username: data.username,
      email: data.email,
      password: data.password,
      password_confirmation: data.passwordConfirmation,
    })
      .unwrap()
      .then((res) => {
        dispatch(setAuth(res))
        getSocket()
      })
      .catch(() => {
        /* error handled above */
      })
  }

  if (isAuthenticated) {
    const to = location?.state?.from?.pathname ?? '/profile'
    return <Navigate to={to} replace />
  }

  return (
    <div className="py-4 w-full">
      <h1 className="text-3xl">Register</h1>

      <Form<FormFields, typeof ValidationSchema>
        mode="all"
        className="py-11 gap-y-6"
        onSubmit={handleSubmit}
        validationSchema={ValidationSchema}
        defaultValues={{
          username: '',
          email: '',
          password: '',
          passwordConfirmation: '',
        }}
      >
        {({ register, formState: { errors } }) => (
          <>
            <FormControl>
              <FormInput
                name="username"
                placeHolder="Username"
                error={!!errors.username?.message}
                register={register}
              />
              <FormErrorMessage size="sm" hidden={!errors?.username?.message}>
                {errors.username?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormInput
                name="email"
                placeHolder="Email"
                error={!!errors.email?.message}
                register={register}
              />
              <FormErrorMessage size="sm" hidden={!errors?.email?.message}>
                {errors.email?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormPasswordInput
                name="password"
                placeHolder="Password"
                error={!!errors.password?.message}
                register={register}
              />
              <FormErrorMessage size="sm" hidden={!errors.password?.message}>
                {errors.password?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormPasswordInput
                name="passwordConfirmation"
                placeHolder="Confirm Password"
                error={!!errors.passwordConfirmation?.message}
                register={register}
              />
              <FormErrorMessage size="sm" hidden={!errors?.passwordConfirmation?.message}>
                {errors.passwordConfirmation?.message}
              </FormErrorMessage>
            </FormControl>

            <div className="flex justify-end">
              <Button type="submit" loading={isRegistering}>
                Register
              </Button>
            </div>
          </>
        )}
      </Form>
    </div>
  )
}
