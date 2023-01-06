import { Message } from '@/types/Models/Message'

type ChatItemProps = {
  value: Message
}

export const ChatItem = ({ value }: ChatItemProps): JSX.Element => {
  return (
    <li className="space-y-[6px]">
      <p className="text-base">{value.sender}</p>
      <div className="bg-purple-90 py-2 px-3 text-sm rounded-[4px] inline-block">
        {value.message}
      </div>
    </li>
  )
}
