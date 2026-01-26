import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import WatchList from './Components/watchList/watchList.jsx'
import Details from './Components/Details/Details.jsx'
import { createBrowserRouter,Route,RouterProvider, createRoutesFromElements} from 'react-router-dom'
import RootLayout from './Components/Layouts/RootLayout.jsx'
import Login from './Components/Login/Login.jsx'
import Register,{registerAction} from './Components/Login/Register.jsx'
const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout/>}>
    <Route index element={<App/>}/>
    <Route path="/watchList" element={<WatchList/>}/>
    <Route path="/Details" element={<Details/>}/>
    <Route path="/login" element={<Login/>} />
    <Route path="register" element={<Register/>} action={registerAction}/>
    </Route>
  ) 
)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
);