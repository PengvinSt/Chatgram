import { InfoIcon } from '@chakra-ui/icons'
import { Avatar, Box, Button, Divider, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '../../../../../App'
import api from '../../../../../http/core'
import UserListItem from '../userArrayMap/UserListItem'


export default observer(function RightSlider({setFetchAgain, fetchAgain}) {
    const { isOpen, onOpen, onClose} = useDisclosure()
    const {storeUser, storeChat} = useContext(Context)

    const leaveGroupChatHendler = async() =>{
        storeChat.setLoading(true)
        try {
          await api.put('/chat/groupremove',{chatId:storeChat.selectedChatsData._id, userId:storeUser.userData.user._id})
        } catch (error) {
          console.error(error)
        }
        storeChat.setLoading(false)
        storeChat.setDummySelectedChatsData(storeUser.userData.user._id)
        // setFetchAgain(!fetchAgain)
      }

  return (
    <>
    <Button variant='ghost' onClick={onOpen} color="var(--main-buttons-color-text)" background="var(--main-buttons-color)" padding="0">
        <InfoIcon/>
    </Button>

    <Drawer placement='right' onClose={onClose} isOpen={isOpen}>
    <DrawerOverlay />
    <DrawerContent background="var(--main-background-color)"  color="var(--main-text-color)" border="1px solid var(--main-buttons-color)">
    <DrawerCloseButton onClick={onClose}/>
    <DrawerHeader>Chat info</DrawerHeader>
    <DrawerBody>
        <Box display="flex" flexDir="column" alignItems="center">
            <Divider/>
            <Text fontSize="2xl" margin="5px">{storeChat.selectedChatsData.chatName}</Text>
            <Divider/>
            <Avatar name={storeChat.selectedChatsData.chatName} src={storeChat.selectedChatsData.pic} size="2xl" margin="15px"/>
            <Divider/>
        </Box>
        <Text fontSize="2xl" margin="5px" textAlign="center">Chat Users</Text>
        <Box display="flex" flexDir="column" alignItems="center" gap="5px">
        <Divider/>
            {
                storeChat.selectedChatsData.users.map(user =>
                    user._id !== storeUser.userData.user._id 
                    ?<UserListItem user={user} loading={storeChat.loadingChat} key={user._id} handleFunction={()=>{storeChat.accessChat(user._id,storeUser.userData.user._id); onClose()}}/>
                    :<UserListItem user={user} loading={storeChat.loadingChat} key={user._id} />
                )
            }
        <Divider/>
        </Box>
    </DrawerBody>
    <DrawerFooter>
        <Button width='100%'  color="var(--main-buttons-color-text)" background="var(--main-buttons-color)" mr={3} onClick={onClose}>
            Close
        </Button>
        {storeUser.userData.user._id !== storeChat.selectedChatsData.groupAdmin._id &&
        <Button onClick={()=>{onClose(); leaveGroupChatHendler()}} colorScheme='red' isLoading={storeChat.loading} width='100%'  color="var(--main-buttons-color-text)" background="var(--main-buttons-color)" mr={3}>
        Leave
        </Button>
        }
    </DrawerFooter>
    </DrawerContent>
    </Drawer>
    </>
  )
})
