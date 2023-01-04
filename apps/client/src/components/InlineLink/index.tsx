import { VariantProps } from 'class-variance-authority'
import classNames from 'classnames'
import { AnchorHTMLAttributes } from 'react'
import { Link, LinkProps, useLocation } from 'react-router-dom'
import { button } from '../Button'

interface InlineLinkBaseProps extends AnchorHTMLAttributes<HTMLAnchorElement>, LinkProps {}

interface InlineLinkProps extends InlineLinkBaseProps, VariantProps<typeof button> {}

export const InlineLink = ({ children, className, ...props }: InlineLinkProps): JSX.Element => {
  const location = useLocation()

  return (
    <Link className={classNames(button(props), className)} {...props} state={{ from: location }}>
      {children}
    </Link>
  )
}
