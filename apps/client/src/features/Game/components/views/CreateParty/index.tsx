import { Button, Form, FormControl, FormInput } from '@/components'
import { useCreatePartyMutation } from '@/features/Party'
import { RootState } from '@/store'
import { setPartyStep } from '@/store/slices/game'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { z } from 'zod'

type FormFields = {
  name: string
}

const ValidationSchema = z.object({
  name: z.string(),
})

export const CreatePartyView = (): JSX.Element => {
  const dispatch = useDispatch()

  const { party } = useSelector((state: RootState) => ({
    party: state.party,
  }))

  const [createParty, { isLoading: creatingParty }] = useCreatePartyMutation()

  if (party?.isActive) {
    return <Navigate to={`/party/${party.name}`} />
  }

  return (
    <div>
      <Form<FormFields, typeof ValidationSchema> onSubmit={createParty}>
        {({ register }) => (
          <>
            <FormControl>
              <FormInput name="name" placeHolder="Enter name" register={register} />
            </FormControl>
            <div className="mt-12 w-full gap-4 px-6 justify-center sm:gap-20 flex flex-wrap sm:flex-nowrap sm:items-center">
              <Button
                onClick={() => dispatch(setPartyStep('options'))}
                variant="blank"
                className="w-min"
                block
              >
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
