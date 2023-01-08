import { useAutoScroll } from '@/hooks/useAutoScroll'
import { RootState } from '@/store'
import classNames from 'classnames'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

type ChatListProps = {
  offset?: number
  className?: string
  children: ReactNode
}

export const ChatList = ({ className, offset = 600, children }: ChatListProps): JSX.Element => {
  const [initialScroll, setInitialScroll] = useState(false)

  const scrollRef = useRef<HTMLUListElement>(null)

  const { messages } = useSelector((state: RootState) => ({
    messages: state.chat.messages,
  }))

  const { scrollToBottom } = useAutoScroll<HTMLUListElement | null>(scrollRef, {
    deps: [messages],
    offset: messages?.length ? offset : 0,
  })

  useEffect(() => {
    if (messages?.length && !initialScroll) {
      scrollToBottom()
      setInitialScroll(true)
    }
  }, [messages?.length, initialScroll])

  return (
    <ul
      ref={scrollRef}
      className={classNames('flex flex-col gap-y-4 overflow-y-auto scrollbar-hide', className)}
    >
      {children}
    </ul>
  )
}
