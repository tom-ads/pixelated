import { Card } from '@/components'
import { ChatList } from '../../ChatList'
import { SendMessageForm } from '../../Forms'

export const ChatCard = (): JSX.Element => {
  return (
    <Card className="min-h-full">
      <ChatList />

      <div className="mt-auto flex">
        <SendMessageForm />
      </div>
    </Card>
  )
}
