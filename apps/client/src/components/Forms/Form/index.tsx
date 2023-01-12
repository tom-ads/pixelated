import classNames from 'classnames'
import { ReactNode, useEffect } from 'react'
import {
  DeepPartial,
  FieldValues,
  SubmitHandler,
  useForm,
  UseFormReturn,
  ValidationMode,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodType } from 'zod'
import { cloneDeep, isEqual } from 'lodash'
import { useQueryError } from '@/hooks/useQueryError'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { SerializedError } from '@reduxjs/toolkit'

export type FormChangeCallback<TFormValues extends FieldValues> = (
  fields: TFormValues,
  methods: UseFormReturn<TFormValues>,
) => void

export type FormProps<TFormValues extends FieldValues, ValidationSchema extends ZodType> = {
  onChange?: (fields: TFormValues, methods: UseFormReturn<TFormValues>) => void
  onSubmit?: (fields: TFormValues, methods: UseFormReturn<TFormValues>) => void
  className?: string
  validationSchema?: ValidationSchema
  children: (methods: UseFormReturn<TFormValues>) => ReactNode
  defaultValues?: DeepPartial<TFormValues>
  mode?: keyof ValidationMode
  queryError?: FetchBaseQueryError | SerializedError
}

export const Form = <TFormValues extends FieldValues, ValidationSchema extends ZodType>({
  onSubmit,
  className,
  validationSchema,
  children,
  onChange,
  defaultValues,
  mode = 'all',
  queryError,
}: FormProps<TFormValues, ValidationSchema>): JSX.Element => {
  const methods = useForm<TFormValues>({
    mode,
    defaultValues,
    resolver: validationSchema && zodResolver(validationSchema),
  })

  useQueryError<TFormValues>(methods.setError, queryError)

  useEffect(() => {
    if (onChange) {
      onChange(cloneDeep(methods.getValues()), methods)
    }
  }, [methods.watch(), onChange])

  useEffect(() => {
    if (!isEqual(methods.formState.defaultValues, defaultValues)) {
      methods.reset(defaultValues)
    }
  }, [defaultValues])

  const handleSubmit: SubmitHandler<TFormValues> = (fields: TFormValues) => {
    if (onSubmit) {
      onSubmit(fields, methods)
    }
  }

  return (
    <form onSubmit={methods.handleSubmit(handleSubmit)} className="w-full">
      <fieldset className={classNames('flex flex-col w-full', className)}>
        {children(methods)}
      </fieldset>
    </form>
  )
}
