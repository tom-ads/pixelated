import { Button, Form, FormControl, FormInput } from '@/components'
import { useGetMessagesQuery, useSendMessageMutation } from '@/features/Chat'
import { RootState } from '@/store'
import classNames from 'classnames'
import { UseFormReturn } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { z } from 'zod'

type FormFields = {
  message: string
}

const ValidationSchema = z.object({
  message: z.string().min(1, { message: 'Message is required' }),
})

type ChatInputProps = {
  block?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export const ChatInput = ({
  className,
  size = 'md',
  block = false,
}: ChatInputProps): JSX.Element => {
  const [sendMessage] = useSendMessageMutation()

  const { partyId } = useSelector((state: RootState) => ({
    partyId: state.party.id,
  }))

  const { isFetching } = useGetMessagesQuery(partyId!, { skip: !partyId })

  const handleSubmit = (data: FormFields, methods: UseFormReturn<FormFields>) => {
    if (partyId) {
      sendMessage({
        partyId,
        message: methods.getValues('message'),
      })
    }

    methods.resetField('message')
  }

  return (
    <Form<FormFields, typeof ValidationSchema>
      mode="onSubmit"
      className={classNames('gap-4 mt-3', className)}
      onSubmit={handleSubmit}
      validationSchema={ValidationSchema}
      defaultValues={{
        message: undefined,
      }}
    >
      {({ register, watch, formState: { errors } }) => (
        <>
          <FormControl>
            <FormInput
              size={size}
              name="message"
              placeHolder="Write a message..."
              register={register}
              error={!!errors.message?.message}
              className="!shadow-none"
            />
          </FormControl>
          <Button
            block={block}
            type="submit"
            size={size}
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
