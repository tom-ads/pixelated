import { ReactNode, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Spinner } from './components'
import { useGetSessionQuery } from './features/Auth'
import { setAuth } from './store/slices/auth'

type AppProps = {
  children: ReactNode
}

const Loader = () => {
  return (
    <div className="min-h-full grid place-content-center">
      <Spinner className="text-white h-6" />
    </div>
  )
}

const App = ({ children }: AppProps): JSX.Element => {
  const dispatch = useDispatch()

  const { data: session, isLoading: loadingSession } = useGetSessionQuery()

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
