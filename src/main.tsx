import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// routes
import Root from './routes/index.tsx'
import Games from './routes/g/index.tsx'
import TicTacToeLobby from './routes/g/tic-tac-toe/index.tsx'
import TicTacToeMatch from './routes/g/tic-tac-toe/_matchID/index.tsx'

const router = createBrowserRouter([
  { path: '/', element: <Root /> },
  { path: '/g', element: <Games /> },
  { path: '/g/tic-tac-toe', element: <TicTacToeLobby /> },
  { path: '/g/tic-tac-toe/:matchID', element: <TicTacToeMatch /> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
