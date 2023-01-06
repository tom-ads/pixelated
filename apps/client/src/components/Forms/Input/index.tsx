import { cva, VariantProps } from 'class-variance-authority'
import classNames from 'classnames'
import { InputHTMLAttributes } from 'react'

export const input = cva(
  'rounded-lg w-full transition-all outline-none appearance-none bg-cyan-80 border placeholder:text-gray-30 text-white',
  {
    variants: {
      size: {
        sm: 'text-xs px-3 py-2 shadow-sm',
        md: 'text-base px-3 py-[10px] shadow-md',
        lg: 'text-lg px-4 py-[10px] shadow-lg',
        xl: 'text-xl px-4 py-[13px] shadow-lg',
      },
      error: {
        true: 'border-red-50 shadow-red-50 active:shadow-red-50 hover:shadow-red-50',
        false:
          'focus:border-yellow-60 focus:shadow-yellow-60 active:border-yellow-70 active:shadow-yellow-70 border-transparent',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
)

export interface FormInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'disabled' | 'size'>,
    VariantProps<typeof input> {
  name: string
  placeHolder: string
  register: any
}

export const FormInput = ({
  name,
  placeHolder,
  size,
  error,
  className,
  register,
}: FormInputProps): JSX.Element => {
  return (
    <input
      id={name}
      type="text"
      placeholder={placeHolder}
      className={classNames(input({ size, error }), className)}
      {...register(name)}
    />
  )
}
