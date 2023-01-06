import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { ChatItem } from '../ChatItem'
import { ChatList } from '../ChatList'

export const ChatContainer = (): JSX.Element => {
  const { messages } = useSelector((state: RootState) => ({
    messages: state.chat.messages,
  }))

  return (
    <ChatList>
      {messages?.map((message) => (
        <ChatItem key={message.id} value={message} />
      ))}
    </ChatList>
  )
}
