import { Card } from '@/components'
import { ChatInput, ChatItem, ChatList } from '@/features/Chat'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'

export const ChatCard = (): JSX.Element => {
  const { messages } = useSelector((state: RootState) => ({
    messages: state.chat.messages,
  }))

  return (
    <Card>
      <ChatList>
        {messages?.map((message) => (
          <ChatItem key={message.id} value={message} />
        ))}
      </ChatList>

      <div className="mt-auto flex">
        <ChatInput className="!flex-row" />
      </div>
    </Card>
  )
}
