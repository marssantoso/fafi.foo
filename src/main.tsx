import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// routes
import Root from './routes/index.tsx'
import { TicTacToeClient } from './games'

const router = createBrowserRouter([
  { path: '/', element: <Root /> },
  { path: '/g/tic-tac-toe', element: <TicTacToeClient /> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
