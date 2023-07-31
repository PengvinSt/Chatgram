import React, { createContext, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './components/AppRouter'
import "./App.css";
import userStore from './store/userStore';
import chatStore from './store/chatStore';
import { useToast } from '@chakra-ui/react';

const storeUser = new userStore()
const storeChat = new chatStore()
export const Context = createContext({
  storeUser,
  storeChat
})


export default function App() {
  const toast = useToast()
  useEffect(()=>{
    const token = localStorage.getItem('token')
    if(token){
      storeUser.refreshToken(token)
      toast({
        title: "Session restored successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    // eslint-disable-next-line
  }, [])
  return (
    <Context.Provider value={{
      storeUser,
      storeChat
    }}>
    <BrowserRouter>
      <div className='App'>
      <AppRouter/>
      </div>
    </BrowserRouter>
    </Context.Provider>
  )
}
