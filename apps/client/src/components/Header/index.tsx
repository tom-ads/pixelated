import { InlineLink } from '../InlineLink'

export const Header = (): JSX.Element => {
  return (
    <div className="flex justify-between items-center mb-8">
      <InlineLink to="/profile" variant="blank">
        (P)ixelated
      </InlineLink>
      <InlineLink to="/party">Play!</InlineLink>
    </div>
  )
}
