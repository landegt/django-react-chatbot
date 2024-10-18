import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import './index.css'

import RootLayout from './routes/RootLayout'
import Recommendations from './routes/Recommendations'
import ViewData from './routes/ViewData'
import CreateData from './routes/CreateData'


import { action as generateDataAction } from './routes/CreateData'
import { loader as viewDataLoader } from './routes/ViewData'


const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {path: '/', element: <Recommendations />},
      {path: '/view-data', element: <ViewData />, loader: viewDataLoader},
      {path: '/create-data', element: <CreateData />, action: generateDataAction},
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
