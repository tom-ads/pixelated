import { InlineLink } from '../InlineLink'

export const Header = (): JSX.Element => {
  return (
    <div className="flex justify-between items-center mb-8">
      <p className="text-xl">(P)ixelated</p>
      <InlineLink to="/play">Play!</InlineLink>
    </div>
  )
}
