import { useRoutes } from 'react-router-dom'
import { privateRoutes } from './private'
import { publicRoutes } from './public'

const NotFoundPage = (): JSX.Element => {
  return <p>Not found</p>
}

const AppRouter = () => {
  const routes = useRoutes([
    ...publicRoutes,
    ...privateRoutes,
    { element: <NotFoundPage />, path: '*' },
  ])

  return routes
}

export default AppRouter
