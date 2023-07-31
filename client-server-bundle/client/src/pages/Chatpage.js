import React, { useContext, useState} from 'react'
// import api from '../http/core'
import { Context } from '../App'
import { observer } from 'mobx-react-lite'
import { Box } from '@chakra-ui/react'
import Navbar from '../components/PageComponents/Chatpage/Main/Navbar'
import ChatsList from '../components/PageComponents/Chatpage/Main/ChatsList'
import ChatBox from '../components/PageComponents/Chatpage/Main/ChatBox'





export default observer(function Chatpage() {
  const {storeUser} = useContext(Context)
  const [fetchAgain, setFetchAgain] = useState(false)
  return (
    <div style={{width:"100%"}}>
      {storeUser.userData && <Navbar/>}
      <Box display='flex' justifyContent='space-between' width='100%' height='91.5vh' padding='10px' background="var(--main-background-color)"  color="var(--main-text-color)">
      {storeUser.userData && <ChatsList fetchAgain={fetchAgain} />}
      {storeUser.userData && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
  )
})
