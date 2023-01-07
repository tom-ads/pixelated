import classNames from 'classnames'
import { ReactNode } from 'react'

type CardProps = {
  className?: string
  children: ReactNode
}

export const Card = ({ className, children }: CardProps): JSX.Element => {
  return (
    <div
      className={classNames('rounded-lg bg-cyan-90 p-5 w-full flex flex-col flex-grow', className)}
    >
      {children}
    </div>
  )
}
