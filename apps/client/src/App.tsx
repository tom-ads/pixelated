import { ReactNode, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Loader } from './components'
import { useGetSessionQuery } from './features/Auth'
import { RootState } from './store'
import { setAuth } from './store/slices/auth'
import { setParty } from './store/slices/party'

type AppProps = {
  children: ReactNode
}

const App = ({ children }: AppProps): JSX.Element => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { party } = useSelector((state: RootState) => ({
    party: state.party,
  }))

  const { data: session, isLoading: loadingSession } = useGetSessionQuery()

  // Set authenticated, if there is an active session
  useEffect(() => {
    if (session) {
      dispatch(setAuth(session.user))
      if (session.party) {
        dispatch(setParty(session.party))
      }
    }
  }, [session])

  useEffect(() => {
    if (party.isActive) {
      navigate(`/party/${party.name}`)
    }
  }, [party])

  if (loadingSession) {
    return <Loader />
  }

  return <div className="min-h-full h-full">{children}</div>
}

export default App
