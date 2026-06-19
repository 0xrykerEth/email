import Auth from './Pages/Auth'
import React from 'react'
import { Route, Router, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Mailbox from './Pages/Mailbox'



function App() {
 return ( 
    <Routes>
       <Route path='/' element={<Auth/>}/>
       <Route path='/Home' element={<Home/>}/>
       <Route path='/Inbox' element={<Mailbox/>}/>
    </Routes>
  )
}

export default App
