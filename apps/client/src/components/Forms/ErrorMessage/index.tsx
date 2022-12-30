import classNames from 'classnames'
import { ReactNode } from 'react'

type FormErrorMessageProps = {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  hidden?: boolean
  children: ReactNode
}

const FormErrorMessage = ({
  size = 'md',
  className,
  hidden,
  children,
}: FormErrorMessageProps): JSX.Element => {
  return (
    <p
      className={classNames(
        'text-red-50 transition',
        {
          'text-xs mt-2': size === 'sm' || size === 'md',
          'text-sm mt-3': size === 'lg',
          invisible: hidden,
        },
        className,
      )}
    >
      {children}
    </p>
  )
}

export default FormErrorMessage
