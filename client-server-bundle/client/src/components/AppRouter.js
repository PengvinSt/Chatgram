import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Homepage from '../pages/Homepage'
import Chatpage from '../pages/Chatpage'
import { Context } from '../App.js'
import { observer } from 'mobx-react-lite'

export default observer(function AppRouter() {

  const {storeUser} = useContext(Context)

  return (
    (storeUser.isAuth)
    ?
    <Routes>
      <Route path='/chats' element={<Chatpage/>}/>
      <Route path="/*" element={<Navigate to="/chats" replace />} />
    </Routes>
    :
    <Routes>
      <Route path='/' element={<Homepage/>}/>
      <Route path="/*" element={<Navigate to="/" replace />} />
    </Routes>
  )
})
