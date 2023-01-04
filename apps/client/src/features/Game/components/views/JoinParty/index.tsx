import { Button, Form, FormControl, FormInput, InlineLink } from '@/components'
import { setPartyStep } from '@/store/slices/game'
import { useDispatch } from 'react-redux'
import { z } from 'zod'

type FormFields = {
  code: string
}

const ValidationSchema = z.object({
  code: z.string(),
})

export const JoinPartyView = (): JSX.Element => {
  const dispatch = useDispatch()

  const handleSubmit = (data: FormFields) => {
    console.log(data)
  }

  return (
    <div>
      <Form<FormFields, typeof ValidationSchema> onSubmit={handleSubmit}>
        {({ register }) => (
          <>
            <FormControl>
              <FormInput name="code" placeHolder="Enter code" register={register} />
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
              <Button type="submit" block>
                Join
              </Button>
            </div>
          </>
        )}
      </Form>
    </div>
  )
}
