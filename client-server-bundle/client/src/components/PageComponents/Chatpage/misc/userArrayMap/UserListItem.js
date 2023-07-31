import React, { useContext } from 'react'
import { Avatar, AvatarBadge, Box, Spinner, Text } from '@chakra-ui/react'
import { Context } from '../../../../../App'


export default function UserListItem({user, handleFunction, loading}) {

  const {storeUser, storeChat} = useContext(Context)

  const isOnline = (user, isOnlineUser) =>{
    const online = isOnlineUser.find(userOnline => userOnline.userId === user._id)
     if(online){
       return true
     }else{
       return false
     }
   }

  return (
    <Box onClick={handleFunction} cursor="pointer" color="var(--main-buttons-color-text)" background="var(--main-buttons-color)" _hover={{background: "#38B2AC",color: "white"}} width="100%" display="flex" alignItems="center" padding="2px 3px" marginBottom={2} borderRadius="lg" >
    <Avatar marginRight={2} size="sm" cursor="pointer" name={user.name} src={user.pic} >
    {isOnline(user, storeChat.isOnlineUser) 
    ?<AvatarBadge boxSize='1.25em' bg='green.500'/>
    : null}
    </Avatar>
    <Box>
        <Text>{user._id !== storeUser.userData.user._id 
        ? user.name
        : `${user.name} (You)`
        }</Text>
    </Box>
      {loading && <Spinner ml="auto" display="flex"/>}
    </Box>
  )
}
