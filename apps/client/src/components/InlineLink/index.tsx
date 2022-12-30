import { VariantProps } from 'class-variance-authority'
import classNames from 'classnames'
import { AnchorHTMLAttributes } from 'react'
import { Link, LinkProps } from 'react-router-dom'
import { button } from '../Button'

interface InlineLinkBaseProps extends AnchorHTMLAttributes<HTMLAnchorElement>, LinkProps {}

interface InlineLinkProps extends InlineLinkBaseProps, VariantProps<typeof button> {}

export const InlineLink = ({ children, className, ...props }: InlineLinkProps): JSX.Element => {
  return (
    <Link className={classNames(button(props), className)} {...props}>
      {children}
    </Link>
  )
}
