import Auth from './Pages/Auth'
import React from 'react'
import { Route, Router, Routes } from 'react-router-dom'
import Home from './Pages/Home'



function App() {
 return ( 
    <Routes>
       <Route path='/' element={<Auth/>}/>
       <Route path='/Home' element={<Home/>}/>
    </Routes>
  )
}

export default App
