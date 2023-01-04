import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import AppRouter from './routes'
import { store } from './store'

import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App>
          <AppRouter />
        </App>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
