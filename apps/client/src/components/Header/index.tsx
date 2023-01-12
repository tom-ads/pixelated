import { useLocation } from 'react-router-dom'
import { InlineLink } from '../InlineLink'

export const Header = (): JSX.Element => {
  const location = useLocation()

  const hideAction = location.pathname === '/profile'

  return (
    <div className="flex justify-between items-center mb-8 h-[46px]">
      <InlineLink to="/profile" variant="blank">
        (P)ixelated
      </InlineLink>
      {hideAction && <InlineLink to="/party">Play!</InlineLink>}
    </div>
  )
}
