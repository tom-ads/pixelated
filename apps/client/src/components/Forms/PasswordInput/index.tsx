import { EyeClosedIcon } from '@/components/Icons/EyeClosedIcon'
import { EyeOpenIcon } from '@/components/Icons/EyeOpenIcon'
import { useState } from 'react'
import { FormInputProps, input } from '../Input'

export const FormPasswordInput = ({
  name,
  size = 'md',
  placeHolder,
  error,
  register,
}: FormInputProps): JSX.Element => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="w-full relative">
      <input
        id={name}
        {...register(name)}
        placeholder={placeHolder}
        className={input({ size, error })}
        type={showPassword ? 'text' : 'password'}
      />

      <div className="absolute inset-y-0 right-[12px] flex items-center">
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="w-5 h-5 outline-none text-white focus-visible:text-yellow-60 focus:text-yellow-60"
        >
          {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
        </button>
      </div>
    </div>
  )
}
