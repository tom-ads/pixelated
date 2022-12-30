import { ReactNode } from 'react'

type AppProps = {
  children: ReactNode
}

const App = ({ children }: AppProps): JSX.Element => {
  return (
    <div className="max-w-lg mx-auto px-4 md:px-8 min-h-full flex flex-col shrink-0 justify-center">
      {children}
    </div>
  )
}

export default App
