import classNames from 'classnames'

type DividerProps = {
  className?: string
}

export const Divider = ({ className }: DividerProps): JSX.Element => {
  return <div className={classNames('h-[1px] bg-white w-full my-4', className)}></div>
}
