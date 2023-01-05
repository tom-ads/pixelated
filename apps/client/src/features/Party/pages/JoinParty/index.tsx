import { Button, Form, FormControl, FormInput } from '@/components'
import FormErrorMessage from '@/components/Forms/ErrorMessage'
import useSocketError from '@/hooks/useSocketError'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useJoinPartyMutation } from '../../api'

type FormFields = {
  code: string
}

const ValidationSchema = z.object({
  code: z.string().min(1, { message: 'Code is required' }),
})

export const JoinPartyPage = (): JSX.Element => {
  const navigate = useNavigate()

  const [joinParty, { isLoading: joiningParty, error }] = useJoinPartyMutation()

  const [socketError, { clearError }] = useSocketError(error)

  const handleSubmit = (data: FormFields) => {
    clearError()
    joinParty(data)
  }

  return (
    <Form<FormFields, typeof ValidationSchema>
      onSubmit={handleSubmit}
      validationSchema={ValidationSchema}
      defaultValues={{
        code: undefined,
      }}
    >
      {({ register, formState: { errors } }) => (
        <>
          <FormControl>
            <FormInput
              name="code"
              placeHolder="Enter code"
              register={register}
              error={!!errors.code?.message}
            />
            <FormErrorMessage size="md" hidden={!errors.code?.message}>
              {errors.code?.message}
            </FormErrorMessage>
          </FormControl>
          <div className="mt-12 w-full gap-4 px-6 justify-center sm:gap-20 flex flex-wrap sm:flex-nowrap sm:items-center">
            <Button
              onClick={() => navigate('/party')}
              variant="blank"
              className="w-min"
              loading={joiningParty}
              block
            >
              Back
            </Button>
            <Button type="submit" block>
              Join
            </Button>
          </div>
          <FormErrorMessage size="lg" hidden={!socketError?.message} className="text-center mt-6">
            {socketError?.message}
          </FormErrorMessage>
        </>
      )}
    </Form>
  )
}
