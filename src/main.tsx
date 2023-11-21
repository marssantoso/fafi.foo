import React from 'react'
import ReactDOM from 'react-dom/client'
import { Helmet, HelmetProvider } from "react-helmet-async";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import '~/assets/main.css'

// routes
import Root from './routes/index.tsx'
import Games from './routes/g/index.tsx'
import GameLobby from '~/routes/g/_gameID/index.tsx'
import GameMatch from '~/routes/g/_gameID/_matchID/index.tsx'

// store
import playerNameReducer from './store/playerName'

const router = createBrowserRouter([
  { path: '/', element: <Root /> },
  {
    path: '/g',
    element: <Games />,
    children: [
      { path: '/g/:gameID', element: <GameLobby /> },
      { path: '/g/:gameID/:matchID', element: <GameMatch /> },
    ],
  },
])

const store = configureStore({
  reducer: {
    playerName: playerNameReducer,
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <Helmet>
          <title>fafi.foo</title>
        </Helmet>
        <RouterProvider router={router} />
      </HelmetProvider>
    </Provider>
  </React.StrictMode>
)
