import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

// routes
import Root from './routes/index.tsx'
import Games from './routes/g/index.tsx'
import TicTacToeLobby from './routes/g/tic-tac-toe/index.tsx'
import TicTacToeMatch from './routes/g/tic-tac-toe/_matchID/index.tsx'

// store
import playerNameReducer from './store/playerName'

const router = createBrowserRouter([
  { path: '/', element: <Root /> },
  {
    path: '/g',
    element: <Games />,
    children: [
      { path: '/g/tic-tac-toe', element: <TicTacToeLobby /> },
      { path: '/g/tic-tac-toe/:matchID', element: <TicTacToeMatch /> },
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
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
)
