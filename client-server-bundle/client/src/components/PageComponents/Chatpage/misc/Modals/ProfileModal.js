import { SettingsIcon } from '@chakra-ui/icons'
import { Avatar, Button, IconButton, Modal, ModalContent, ModalFooter, ModalHeader, useDisclosure, Text, ModalOverlay, ModalCloseButton, ModalBody, Divider, ButtonGroup, Checkbox, Box, Input, useToast } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import { Context } from '../../../../../App'
import api from '../../../../../http/core'


export default function ProfileModal({user,children, fetchAgain,setFetchAgain}) {
    const { isOpen, onOpen, onClose} = useDisclosure()
    const [accDelete, setAccDelete] = useState(false)
    const [chatsDelete, setChatsDelete] = useState(false)
    const [loading, setLoading] = useState(false)
    const [newName, setNewName] = useState('')
    const [newPic, setNewPic] = useState(null)
    const {storeUser, storeChat} = useContext(Context)
    const toast = useToast()

    const changeDataHandler = async ()=>{
        setLoading(true)
        
        if(!newName && !newPic){
            toast({
                title: "Please Enter something to change",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            setLoading(false)
            return
        }
        if(newName === storeUser.userData.user.name){
            toast({
                title: "You can't change your username on same one!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            setLoading(false)
            return
        }
        try {
            await api.post('/user/changeuserdata', {newUsername:newName, loggedUserId:storeUser.userData.user._id, newPic},{
                headers:{
                    'content-type': 'multipart/form-data'
                }
            })
            // setFetchAgain(!fetchAgain)
            toast({
                title: `Succsesfully changed name on ${newName}`,
                description:'restart page to see update in profile',
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            setLoading(false)
        }catch(error){
                toast({
                    title: error.response.data.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                });
                setLoading(false)        
        }       
    }
    const deleteUserHandler = async () => {
        setLoading(true)
        try {
            await api.post('/user/deleteuser', {loggedUserId:storeUser.userData.user._id, isChatDelete:chatsDelete})
            setAccDelete(false)
            setChatsDelete(false)
            setLoading(false)
            storeUser.setAuth(false)
        } catch (error) {
           console.log(error) 
           setLoading(false)
        }
        
        
    }
    const deleteLocalChatHandler = async ()=>{
        setLoading(true)
        try {
            await api.post('/chat/localremove', {chatId:storeChat.selectedChatsData._id, userId:storeUser.userData.user._id}) //chatId, userId
            setLoading(false)
            setFetchAgain(!fetchAgain)
            setAccDelete(false)
            onClose()
          } catch (error) {
            console.log(error)
            setLoading(false)
            setAccDelete(false)
        }
    }

  return (
    <div>
        {
        children 
        ? <span onClick={onOpen}>{children}</span>
        :<IconButton display="flex" background="var(--main-buttons-color)"  color="var(--main-buttons-color-text)" icon={<SettingsIcon />} onClick={onOpen}/>}
        <Modal isOpen={isOpen} onClose={onClose} >
            <ModalOverlay>
            <ModalContent background="var(--main-background-color)"  color="var(--main-text-color)" border="1px solid var(--main-buttons-color)">
                <ModalHeader>{user.name} profile</ModalHeader>
                <ModalCloseButton/>
                <ModalBody display="flex" alignItems="center" flexDir="column" gap="10px">
                    <Avatar cursor='pointer' name={user.name} src={user.pic} size="2xl" border='1px solid black'/>
                    <Divider/>
                    <Text fontSize={{base:"20px", md:"25px"}} fontFamily="Work sans">Email: {user.email}</Text>
                    <Text fontSize={{base:"20px", md:"25px"}} fontFamily="Work sans">Created Date: {user.createdAt.split("T")[0].split("-").reverse().join("-")}</Text>
                    <Divider/>
                    {(user._id === storeUser.userData.user._id) &&
                    <Box display="flex" alignItems="center" flexDir="column" gap="10px" width="100%">
                        <Divider/>
                        <Text fontSize={{base:"20px", md:"25px"}} fontFamily="Work sans">Change your data:</Text>
                         <Input placeholder="Input new name here ..." width="100%" marginBottom={3} value={newName} onChange={(e) => setNewName(e.target.value)} border="none" borderBottom="2px solid var(--main-buttons-color)" borderRadius="none" _hover="var(--main-background-color)" outline="var(--main-buttons-color)"/>
                         <Input type='file' onChange={(e)=>{setNewPic(e.target.files[0])}} width="100%" border="none" borderBottom="2px solid var(--main-buttons-color)" borderRadius="none" _hover="var(--main-background-color)" outline="var(--main-buttons-color)"/>
                         <Button onClick={()=>{changeDataHandler()}} color="var(--main-buttons-color-text)" background="var(--main-buttons-color)" width="100%" isLoading={loading}>
                        Submit
                        </Button>
                        <Divider/>
                    </Box>
                    }
                </ModalBody>
                <ModalFooter display="flex" alignItems="center" flexDir='column' gap="10px">
                    <Button onClick={onClose} color="var(--main-buttons-color-text)" background="var(--main-buttons-color)" width="100%" isLoading={loading}>
                        Close
                    </Button>
                    {(storeChat.selectedChatsData._id !== undefined && user._id !== storeUser.userData.user._id) 
                    ? (accDelete)
                        ?<>
                        <Divider/>
                        <Text fontSize={{base:"18px", md:"20px"}} fontFamily="Montserrat ">Are you shure?</Text> 
                        <Divider/>
                        <ButtonGroup width="100%" display="flex" alignItems="center" justifyContent='center'>
                        <Button onClick={()=>{deleteLocalChatHandler()}} colorScheme='red' width='50%' isLoading={loading}>Yes</Button>
                        <Button onClick={()=>{setAccDelete(false)}} colorScheme='blue' width='50%' isLoading={loading}>No</Button>
                        </ButtonGroup>
                        </>
                        : <Button onClick={()=>{setAccDelete(true)}} colorScheme='red' width="100%">Delete Chat</Button>
                    : null
                    }
                    {(user._id === storeUser.userData.user._id) 
                    ? (accDelete)
                        ?<>
                        <Divider/>
                        <Text fontSize={{base:"18px", md:"20px"}} fontFamily="Work sans">Are you shure?</Text> 
                        <Divider/>
                        <ButtonGroup width="100%" display="flex" alignItems="center" justifyContent='center'>
                        <Button onClick={()=>{deleteUserHandler()}} colorScheme='red' width='50%' isLoading={loading}>Yes</Button>
                        <Button onClick={()=>{setAccDelete(false)}} colorScheme='blue' width='50%' isLoading={loading}>No</Button>
                        </ButtonGroup>
                        <Checkbox  onChange={()=>{setChatsDelete(!chatsDelete)}}>Delete all chats</Checkbox>
                        </>
                        : <Button onClick={()=>{setAccDelete(true)}} colorScheme='red' width="100%">Delete Account</Button>
                    : null
                    }
                </ModalFooter>
            </ModalContent>
            </ModalOverlay>
        </Modal>
    </div>
  )
}
