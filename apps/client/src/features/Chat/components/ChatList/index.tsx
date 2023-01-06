import { ChevronIcon } from '@/components/Icons'
import { useAutoScroll } from '@/hooks/useAutoScroll'
import { RootState } from '@/store'
import { ReactNode, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'

type ChatListProps = {
  children: ReactNode
}

export const ChatList = ({ children }: ChatListProps): JSX.Element => {
  const scrollRef = useRef<HTMLUListElement>(null)

  const { messages } = useSelector((state: RootState) => ({
    messages: state.chat.messages,
  }))

  const { scrollToBottom } = useAutoScroll<HTMLUListElement | null>(scrollRef, {
    deps: [messages],
    offset: 600,
  })

  return (
    <div className="relative flex flex-col flex-grow">
      <ul
        ref={scrollRef}
        className="flex flex-col gap-y-4 overflow-y-scroll my-4 max-h-[400px] scrollbar-hide"
      >
        {children}
      </ul>
      {/* <button
        onClick={scrollToBottom}
        className="absolute outline-none grid place-content-center bottom-4 left-1/2 -translate-x-[18px] rounded-full w-10 h-10 shadow-md bg-cyan-80"
      >
        <ChevronIcon className="text-white w-6" />
      </button> */}
    </div>
  )
}
