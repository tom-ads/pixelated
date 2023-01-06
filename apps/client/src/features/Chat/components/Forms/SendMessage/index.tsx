import { Button, Form, FormControl, FormInput } from '@/components'
import { useGetMessagesQuery, useSendMessageMutation } from '@/features/Chat'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { z } from 'zod'

type FormFields = {
  message: string
}

const ValidationSchema = z.object({
  message: z.string().min(1, { message: 'Message is required' }),
})

export const SendMessageForm = (): JSX.Element => {
  const [sendMessage] = useSendMessageMutation()

  const { partyId } = useSelector((state: RootState) => ({
    partyId: state.party.id,
  }))

  const { isFetching } = useGetMessagesQuery(partyId!, { skip: !partyId })

  const handleSubmit = (data: FormFields) => {
    console.log(data)
  }

  return (
    <Form<FormFields, typeof ValidationSchema>
      mode="onSubmit"
      className="flex !flex-row gap-4"
      onSubmit={handleSubmit}
      validationSchema={ValidationSchema}
      defaultValues={{
        message: undefined,
      }}
    >
      {({ register, watch, resetField, getValues, formState: { errors } }) => (
        <>
          <FormControl>
            <FormInput
              name="message"
              placeHolder="Write a message..."
              register={register}
              error={!!errors.message?.message}
              className="!shadow-none"
            />
          </FormControl>
          <Button
            onClick={() => {
              if (partyId) {
                sendMessage({
                  partyId,
                  message: getValues('message'),
                })
                resetField('message')
              }
            }}
            loading={isFetching}
            disabled={!watch('message')}
            className="shadow-none"
          >
            Send
          </Button>
        </>
      )}
    </Form>
  )
}
