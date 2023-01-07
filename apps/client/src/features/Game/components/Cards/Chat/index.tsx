import { Card } from '@/components'
import { ChatInput, ChatItem, ChatList } from '@/features/Chat'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'

export const ChatCard = (): JSX.Element => {
  const { messages } = useSelector((state: RootState) => ({
    messages: state.chat.messages,
  }))

  return (
    <Card className="max-h-[500px]">
      <ChatList>
        {messages?.map((message) => (
          <ChatItem size="sm" key={message.id} value={message} />
        ))}
      </ChatList>

      <div className="mt-auto flex">
        <ChatInput size="sm" block />
      </div>
    </Card>
  )
}
