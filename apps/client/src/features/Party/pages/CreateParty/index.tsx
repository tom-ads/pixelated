import { Button, Form, FormControl, FormInput } from '@/components'
import FormErrorMessage from '@/components/Forms/ErrorMessage'
import { useCreatePartyMutation } from '@/features/Party'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { z } from 'zod'

type FormFields = {
  name: string
}

const ValidationSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
})

export const CreatePartyPage = (): JSX.Element => {
  const navigate = useNavigate()

  const { party } = useSelector((state: RootState) => ({
    party: state.party,
  }))

  const [createParty, { isLoading: creatingParty }] = useCreatePartyMutation()

  const handleSubmit = (data: FormFields) => {
    createParty(data)
  }

  if (party?.isActive && party.name) {
    return <Navigate to={`/party/${party.name}`} />
  }

  return (
    <div>
      <Form<FormFields, typeof ValidationSchema>
        validationSchema={ValidationSchema}
        defaultValues={{
          name: undefined,
        }}
        onSubmit={handleSubmit}
      >
        {({ register, formState: { errors } }) => (
          <>
            <FormControl>
              <FormInput
                name="name"
                placeHolder="Enter name"
                register={register}
                error={!!errors.name?.message}
              />
              <FormErrorMessage hidden={!errors.name?.message}>
                {errors.name?.message}
              </FormErrorMessage>
            </FormControl>
            <div className="mt-12 w-full gap-4 px-6 justify-center sm:gap-20 flex flex-wrap sm:flex-nowrap sm:items-center">
              <Button onClick={() => navigate('/party')} variant="blank" className="w-min" block>
                Back
              </Button>
              <Button type="submit" loading={creatingParty} block>
                Create
              </Button>
            </div>
          </>
        )}
      </Form>
    </div>
  )
}
