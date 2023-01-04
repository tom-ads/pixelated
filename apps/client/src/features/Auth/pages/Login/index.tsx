import { FormInput, Form, FormControl, Button, InlineLink } from '@/components'
import FormErrorMessage from '@/components/Forms/ErrorMessage'
import { FormPasswordInput } from '@/components/Forms/PasswordInput'
import { RootState } from '@/store'
import { setAuth } from '@/store/slices/auth'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { z } from 'zod'
import { useLoginMutation } from '../../api'

type FormFields = {
  username: string
  password: string
}

const ValidationSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
})

export const LoginPage = (): JSX.Element => {
  const dispatch = useDispatch()
  const location = useLocation()

  const { isAuthenticated } = useSelector((state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,
  }))

  const [triggerLogin, { isError: didLoginError, isLoading: isLoggingIn }] = useLoginMutation()

  const handleSubmit = async (data: FormFields) => {
    await triggerLogin(data)
      .unwrap()
      .then((res) => dispatch(setAuth(res.user)))
      // Error is handled with didLoginError
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch((err) => {})
  }

  if (isAuthenticated) {
    const to = location?.state?.from?.pathname ?? '/profile'
    return <Navigate to={to} replace />
  }

  return (
    <div className="py-4">
      <h1 className="text-xl">Welcome to Pixelated!</h1>

      <Form<FormFields, typeof ValidationSchema>
        mode="onSubmit"
        className="py-11 gap-y-6"
        onSubmit={handleSubmit}
        validationSchema={ValidationSchema}
        defaultValues={{ username: '', password: '' }}
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
              {errors.username?.message && (
                <FormErrorMessage size="sm">{errors.username?.message}</FormErrorMessage>
              )}
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
            <div className="px-8 mt-6 w-full gap-4 justify-center sm:gap-11 flex flex-wrap sm:flex-nowrap sm:items-center">
              <Button type="submit" loading={isLoggingIn} block>
                Login
              </Button>
              <InlineLink to="/register" variant="blank">
                Register
              </InlineLink>
            </div>
            <FormErrorMessage size="sm" hidden={!didLoginError} className="text-center">
              Username or password incorrect, please try your details again
            </FormErrorMessage>
          </>
        )}
      </Form>
    </div>
  )
}
