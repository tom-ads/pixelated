import { Card } from '@/components'
import { ChatContainer } from '../../ChatContainer'
import { SendMessageForm } from '../../Forms'

export const ChatCard = (): JSX.Element => {
  return (
    <Card className="min-h-full">
      <ChatContainer />

      <div className="mt-auto flex">
        <SendMessageForm />
      </div>
    </Card>
  )
}
