import { useAutoScroll } from '@/hooks/useAutoScroll'
import { RootState } from '@/store'
import { ReactNode, useRef } from 'react'
import { useSelector } from 'react-redux'

type ChatListProps = {
  children: ReactNode
}

export const ChatList = ({ children }: ChatListProps): JSX.Element => {
  const { messages } = useSelector((state: RootState) => ({
    messages: state.chat.messages,
  }))

  const scrollRef = useRef<HTMLUListElement>(null)
  useAutoScroll<HTMLUListElement | null>(scrollRef, { deps: [messages] })

  // const handleScroll = (e: UIEvent<HTMLUListElement>) => {
  //   if (e.currentTarget.scrollTop !== e.currentTarget.scrollHeight && !hasScrolled) {
  //     setHasScrolled(true)
  //   }

  //   if (e.currentTarget.scrollTop === e.currentTarget.scrollHeight && hasScrolled) {
  //     setHasScrolled(false)
  //   }
  // }

  return (
    <ul ref={scrollRef} className="flex flex-col gap-y-4 overflow-y-scroll my-4 max-h-[400px]">
      {children}
    </ul>
  )
}
