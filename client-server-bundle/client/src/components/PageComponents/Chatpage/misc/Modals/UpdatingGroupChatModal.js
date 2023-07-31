import { SearchIcon, SettingsIcon } from '@chakra-ui/icons'
import { Avatar, Box, Button, ButtonGroup, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import { Context } from '../../../../../App'
import { observer } from 'mobx-react-lite'

import api from '../../../../../http/core'
import UserTagItem from '../userArrayMap/UserTagItem'
import UserListItem from '../userArrayMap/UserListItem'


export default observer(function UpdatingGroupChatModal({fetchAgain,setFetchAgain}) {
  const {storeChat, storeUser} = useContext(Context)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [groupChatName,setGroupChatName] = useState("")
  const [search, setSearch] = useState("")
  const [userToDelete, setUserToDelete] = useState({})
  const [userDelete, setUserDelete] = useState(false)
  const [newPic, setNewPic] = useState(null)
  const toast = useToast()

  const deletedGroupUserHendler = async(user) =>{
    storeChat.setLoading(true)
    if(storeUser.userData.user._id !== storeChat.selectedChatsData.groupAdmin._id){
      toast({
        title: "You are not allowed to delete!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      }); 
      storeChat.setLoading(false)
      setUserDelete(false)
      return
    }
    if(user._id === storeChat.selectedChatsData.groupAdmin._id){
      toast({
        title: "You can't delete admin of chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      }); 
      storeChat.setLoading(false)
      setUserDelete(false)
      return
    }

    try {
      await api.put('/chat/groupremove',{chatId:storeChat.selectedChatsData._id, userId:user._id})
    } catch (error) {
      console.log(error)
      storeChat.setLoading(false)
    }

    storeChat.getMessages()
    storeChat.setLoading(false)
    setUserDelete(false)
    setFetchAgain(!fetchAgain)
  }
  
  const addUserGroupHendler = async(user) =>{
    storeChat.setLoading(true)
    const candidate = storeChat.selectedChatsData.users.find(chatUser => chatUser._id === user._id)
      if(candidate){
        toast({
          title: "User already in chat",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
      }); 
      storeChat.setLoading(false)
      return
    }

    try {
      await api.put('/chat/groupadd',{chatId:storeChat.selectedChatsData._id, userId:user._id})
    } catch (error) {
      console.log(error)
      storeChat.setLoading(false)
    }
    storeChat.getMessages()
    storeChat.setLoading(false)
    storeChat.setSerchResult([])
    setSearch('')
    setFetchAgain(!fetchAgain)
  }

  const renameChatGroupHendler = async(groupChatName) =>{
    storeChat.setLoading(true)
    if(!groupChatName && !newPic){
      toast({
          title: "Please Enter something to change",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
      }); 
      storeChat.setLoading(false)
      return
    }
    try {
      await api.put('/chat/change',{chatId: storeChat.selectedChatsData._id, chatName:groupChatName,newPic},{
        headers:{
            'content-type': 'multipart/form-data'
        }
    })
    } catch (error) {
      console.log(error)
      storeChat.setLoading(false)
    }
    storeChat.getMessages()
    storeChat.setLoading(false)
    setFetchAgain(!fetchAgain)
  }

  const leaveGroupChatHendler = async() =>{
    storeChat.setLoading(true)
    if(storeUser.userData.user._id === storeChat.selectedChatsData.groupAdmin._id){
      try {
        await api.post('/chat/groupremove', {chatId:storeChat.selectedChatsData._id, userId:storeUser.userData.user._id})
      } catch (error) {
        console.log(error)
      }
      setFetchAgain(!fetchAgain)
      storeChat.setLoading(false)
      return
    }
  }

  const searchHendler = async (search,loggedUserId) =>{
    storeChat.setLoading(true)
    if(!search){
        toast({
            title: "Please Enter something in search",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
        }); 
        storeChat.setLoading(false)
        return
    }
    storeChat.searchHendler(search,loggedUserId)
    storeChat.setLoading(false)
  }

  return (
    <>
    <IconButton display={{ base: "flex" }} icon={<SettingsIcon />} onClick={onOpen} background="var(--main-buttons-color)"  color="var(--main-buttons-color-text)"/>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent background="var(--main-background-color)"  color="var(--main-text-color)" border="1px solid var(--main-buttons-color)">
          <ModalHeader fontSize="22px" fontFamily="Work sans" display="flex" justifyContent="center" >{storeChat.selectedChatsData.chatName} Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display='flex' justifyContent='center' alignItems='center' margin='10px'>
            <Avatar cursor='pointer' name={storeChat.selectedChatsData.chatName} size="2xl" border='1px solid black' src={storeChat.selectedChatsData.pic} />
            </Box>
            <>
              {userDelete
                ?<Box display="flex" alignItems="center" flexDir='column' gap="10px">
                    <Text fontSize={{base:"18px", md:"20px"}} fontFamily="Work sans">Are you shure?</Text> 
                    <ButtonGroup width="100%" display="flex" alignItems="center" justifyContent='center'>
                    <Button onClick={()=>{deletedGroupUserHendler(userToDelete)}} colorScheme='red' width='50%' isLoading={storeChat.loading}>Yes</Button>
                    <Button onClick={()=>{setUserDelete(false)}} colorScheme='blue' width='50%' isLoading={storeChat.loading}>No</Button>
                    </ButtonGroup>
                </Box>
                :<Box width="100%" display="flex" flexWrap="wrap">
                    {storeChat.selectedChatsData.users.map(user =><UserTagItem admin={storeChat.selectedChatsData.groupAdmin._id} key={user._id} user={user} handleFunction={()=>{setUserDelete(true);setUserToDelete(user)}}/>)}
                </Box>
              }
            </>
            <>
              <FormControl d="flex">
                <Input placeholder="Chat Name" marginBottom={3} value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)} border="none" borderBottom="2px solid var(--main-buttons-color)" borderRadius="none" _hover="var(--main-background-color)" outline="var(--main-buttons-color)"/>
                <Input marginBottom="10px" type='file' onChange={(e)=>{setNewPic(e.target.files[0])}} width="100%" border="none" borderBottom="2px solid var(--main-buttons-color)" borderRadius="none" _hover="var(--main-background-color)" outline="var(--main-buttons-color)"/>
                <Button  width="100%" isLoading={storeChat.loading} colorScheme="cyan" marginBottom='10px' onClick={()=>{renameChatGroupHendler(groupChatName)}}  background="var(--main-buttons-color)"  color="var(--main-buttons-color-text)">
                  Update
                </Button>
              </FormControl>
            </> 
            <>
              <FormControl>
                <Box display='flex' pb={2}>
                <Input placeholder="Search by username..." marginRight={2} value={search} onChange={(e)=>{setSearch(e.target.value)}} border="none" borderBottom="2px solid var(--main-buttons-color)" borderRadius="none" _hover="var(--main-background-color)" outline="var(--main-buttons-color)"/>
                <IconButton display={{base:'flex'}} icon={<SearchIcon/>} isLoading={storeChat.loading} onClick={()=>{searchHendler(search, storeUser.userData.user._id)}}  background="var(--main-buttons-color)"  color="var(--main-buttons-color-text)"/>
                </Box>
              </FormControl>
              {storeChat.loading 
                ?<Spinner display="flex"/>
                : (
                storeChat.serchResult.map((user) => (<UserListItem key={user._id}
                  user={user} handleFunction={()=>{addUserGroupHendler(user)}}/>
                ))
              )}
            </>
          </ModalBody>
          <ModalFooter display='flex' gap="5px">
            <Button onClick={onClose} color="var(--main-buttons-color-text)" background="var(--main-buttons-color)" width="50%" isLoading={storeChat.loading}>
                Close
            </Button>
            <Button onClick={()=>{onClose(); leaveGroupChatHendler()}} colorScheme='red' width="50%" isLoading={storeChat.loading}>Delete</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
})
