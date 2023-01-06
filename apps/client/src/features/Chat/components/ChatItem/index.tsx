import { MessageType } from '@/enums/MessageType'
import { Message } from '@/types/Models/Message'
import classNames from 'classnames'

type ChatItemProps = {
  value: Message
}

/* 
  Use whitespace-pre-wrap to preserve newlines and spaces in message, while the
  parent is flex'd w/ word break to wrap down onto the next line within the container
*/
export const ChatItem = ({ value }: ChatItemProps): JSX.Element => {
  const isSystemMessage = value.sender === MessageType.SYSTEM_MESSAGE

  return (
    <li className="space-y-[6px]">
      {!isSystemMessage && <p className="text-base">{value.sender}</p>}
      <div className="flex break-words">
        <div
          className={classNames(
            'bg-purple-90 py-2 px-3 text-sm rounded-[4px] whitespace-pre-wrap overflow-x-hidden',
            {
              'text-yellow-60': isSystemMessage,
              'text-white': !isSystemMessage,
            },
          )}
        >
          {value.message}
        </div>
      </div>
    </li>
  )
}
