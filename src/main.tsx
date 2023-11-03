import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// routes
import Root from './routes/index.tsx'
import Games from './routes/g/index.tsx'
import TicTacToeClient from './routes/g/tic-tac-toe/index.tsx'

const router = createBrowserRouter([
  { path: '/', element: <Root /> },
  { path: '/g', element: <Games /> },
  { path: '/g/tic-tac-toe', element: <TicTacToeClient /> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
