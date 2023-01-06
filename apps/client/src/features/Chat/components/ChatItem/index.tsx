import { Message } from '@/types/Models/Message'

type ChatItemProps = {
  value: Message
}

/* 
  Use whitespace-pre-wrap to preserve newlines and spaces in message, while the
  parent is flex'd w/ word break to wrap down onto the next line within the container
*/
export const ChatItem = ({ value }: ChatItemProps): JSX.Element => {
  return (
    <li className="space-y-[6px]">
      <p className="text-base">{value.sender}</p>
      <div className="flex break-words">
        <div className="bg-purple-90 py-2 px-3 text-sm rounded-[4px] whitespace-pre-wrap overflow-x-hidden">
          {value.message}
        </div>
      </div>
    </li>
  )
}
