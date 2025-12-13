import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import WatchList from './Components/watchList/watchList.jsx'
import Details from './Components/Details/Details.jsx'
import { createBrowserRouter,RouterProvider} from 'react-router-dom'
const router=createBrowserRouter([
  {path:"/",element:<App/>},
  {path:"/watchList",element:<WatchList/>},
  {path:"/Details",element:<Details/>}
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
);