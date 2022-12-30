import { ReactNode, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Loader } from './components'
import { useGetSessionQuery } from './features/Auth'
import { setAuth } from './store/slices/auth'

type AppProps = {
  children: ReactNode
}

const App = ({ children }: AppProps): JSX.Element => {
  const dispatch = useDispatch()

  const { data: session, isLoading: loadingSession } = useGetSessionQuery()

  // Set authenticated, if there is an active session
  useEffect(() => {
    if (session) {
      dispatch(setAuth(session.user))
    }
  }, [session])

  if (loadingSession) {
    return <Loader />
  }

  return <div className="min-h-full h-full">{children}</div>
}

export default App
