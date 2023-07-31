import React, { useContext } from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { Context } from '../../../../App'
import { Box} from '@chakra-ui/react'
import NotUserMessage from '../misc/messages/NotUserMessage'
import UserMessage from '../misc/messages/UserMessage'


export default function MessagesField() {
    const {storeChat, storeUser} = useContext(Context)

  

  return (
    <ScrollableFeed>
    {storeChat.messages.map((message, i)=>
    <Box key={i} display='flex' flexDir="column" overflowX='hidden' paddingBottom="10px">
        { message.sender._id === storeUser.userData.user._id 
        ? <UserMessage message={message} index={i}/>
        : <NotUserMessage message={message} index={i}/>}
    </Box>
    )}
    </ScrollableFeed>
  )
}
