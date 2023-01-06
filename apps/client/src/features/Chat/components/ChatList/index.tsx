import { RootState } from '@/store'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { ChatItem } from '../ChatItem'

export const ChatList = (): JSX.Element => {
  const [hasScrolled, setHasScrollded] = useState(false)

  const scrollRef = useRef<HTMLUListElement | null>(null)

  const { messages } = useSelector((state: RootState) => ({
    messages: state.chat.messages,
  }))

  useLayoutEffect(() => {
    if (scrollRef.current && !hasScrolled) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, scrollRef.current, hasScrolled])

  // todo: prevent auto-scrolling if user has scrolled up

  return (
    <ul ref={scrollRef} className="flex flex-col gap-y-4 overflow-y-scroll my-4 max-h-[400px]">
      {messages?.map((message) => (
        <ChatItem key={message.id} value={message} />
      ))}
    </ul>
  )
}
