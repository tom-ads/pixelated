import { cva, VariantProps } from 'class-variance-authority'
import classNames from 'classnames'
import { forwardRef, HtmlHTMLAttributes } from 'react'
import { Spinner } from '../Spinner'

export const button = cva(
  'relative border rounded-lg transition-all duration-200 outline-none text-center my-auto min-h-[30px]',
  {
    variants: {
      variant: {
        primary:
          'text-purple-90 bg-yellow-60 border-yellow-60 hover:bg-yellow-80 hover:border-yellow-80 active:bg-yellow-60 active:border-yellow-60 active:shadow-yellow-60 focus-visible:bg-yellow-80 focus-visible:border-yellow-80 focus:bg-yellow-80 focus:border-yellow-80 focus:shadow-yellow-80',
        blank:
          'text-white hover:text-yellow-80 active:text-yellow-60 bg-none border-none !shadow-none !p-0',
      },
      size: {
        sm: 'text-sm py-2 px-4 shadow-sm',
        md: 'text-base px-4 py-2 shadow-md',
        lg: 'text-xl py-2 px-6 shadow-lg',
        xl: 'text-2xl py-[9px] px-6 shadow-lg',
      },
      block: {
        true: 'w-full',
        false: 'w-min whitespace-nowrap',
      },
      danger: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'primary',
        danger: true,
        className:
          'bg-red-50 border-red-50 text-white hover:bg-red-80 hover:border-red-80 active:bg-red-50 active:border-red-80 focus-visible:bg-red-50 focus-visible:border-red-50 focus:bg-red-50 focus:border-red-50 focus:shadow-red-80',
      },
      {
        variant: 'blank',
        danger: true,
        className:
          'text-red-50 hover:text-red-80 active:text-red-50 focus-visible:text-red-80 focus:text-red-80',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'lg',
      danger: false,
      block: false,
    },
  },
)

interface ButtonProps
  extends Omit<HtmlHTMLAttributes<HTMLButtonElement>, 'disabled' | 'type'>,
    VariantProps<typeof button> {
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, type = 'button', loading, block, danger, ...props },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      className={classNames(button({ block, danger, ...props }), className)}
    >
      <div className="absolute inset-0 grid place-content-center">
        <Spinner
          className={classNames('h-2 text-purple-90', {
            'visible ': loading,
            'text-red-50': danger,
            invisible: !loading,
          })}
        />
      </div>
      <div
        className={classNames({
          invisible: loading,
          'visible flex-shrink-0 gap-x-4': !loading,
        })}
      >
        {props.children}
      </div>
    </button>
  )
})
