import React from 'react'
import { observer } from 'mobx-react-lite'
import { Box } from '@chakra-ui/react'
import ChatField from './ChatField'

export default observer(function ChatBox({fetchAgain,setFetchAgain}) {
  // const {storeChat} = useContext(Context)


  return (
    <Box display="flex" alignItems="center" flexDir="column" padding={3} background="var(--main-background-color)"  color="var(--main-text-color)" width="100%" borderRadius="lg" border="1px solid var(--main-buttons-color)">
       <ChatField fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  )
})
