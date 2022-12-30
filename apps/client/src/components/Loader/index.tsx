import classNames from 'classnames'
import { Spinner } from '../Spinner'

type LoaderProps = {
  className?: string
}

export const Loader = ({ className }: LoaderProps) => {
  return (
    <div className="absolute inset-0 grid place-content-center">
      <Spinner className={classNames('text-white h-6', className)} />
    </div>
  )
}
