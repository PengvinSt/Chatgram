import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import { SearchIcon } from '@chakra-ui/icons'
import { observer } from 'mobx-react-lite'
import { Context } from '../../../../../App'
import UserListItem from '../userArrayMap/UserListItem'
import UserTagItem from '../userArrayMap/UserTagItem'

export default observer(function GroupChatModal({children}) {
    const {storeChat,storeUser} = useContext(Context)
    const toast = useToast()

    const { isOpen, onOpen, onClose} = useDisclosure()
    const [groupChatName,setGroupChatName] = useState("")
    const [selectedUsers,setSelectedUsers] = useState([])
    const [search, setSearch] = useState("")


    const searchSelectedHendler = (user) => {
      if (selectedUsers.includes(user)) {
        toast({
          title: "User already added",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
      setSelectedUsers([...selectedUsers, user]);
    }
    const searchDeletedHendler = (user) => {
      setSelectedUsers(selectedUsers.filter((sel) => sel._id !== user._id));
    }


    const searchHendler = async (search,loggedUserId) =>{
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
    }

    const submitHandler = async (selectedUsers,groupChatName,loggedUserId) =>{
      storeChat.setLoading(true)
      // console.log(loggedUserId)
      if(!groupChatName){
        toast({
            title: "Please Enter Chat name",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
        }); 
        storeChat.setLoading(false)
        return
      }
      if(selectedUsers.length < 2){
        toast({
            title: "You can't make group with 2 or less users",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
        }); 
        storeChat.setLoading(false)
        return
      }
      console.log(selectedUsers,groupChatName,loggedUserId)
      await storeChat.createGroupChat(selectedUsers,groupChatName,loggedUserId)

      storeChat.setLoading(false)
      storeChat.setSerchResult([])
      setSelectedUsers([])
      setSearch("")
      onClose()
    }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay onClick={()=>{setSearch("");storeChat.setSerchResult([])}}/>
        <ModalContent background="var(--main-background-color)"  color="var(--main-text-color)" border="1px solid var(--main-buttons-color)">
          <ModalHeader fontSize="35px" fontFamily="Work sans" display="flex" justifyContent="center">Create Group Chat</ModalHeader>
          <ModalCloseButton onClick={()=>{setSearch("");storeChat.setSerchResult([])}}/>
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input placeholder='Chat name' marginBottom='3px' onChange={(e)=>{setGroupChatName(e.target.value)}} border="none" borderBottom="2px solid var(--main-buttons-color)" borderRadius="none" _hover="var(--main-background-color)" outline="var(--main-buttons-color)"/>
            </FormControl>
            <FormControl>
            <Box display='flex' pb={2}>
            <Input placeholder="Search by username..." marginRight={2} value={search} onChange={(e)=>{setSearch(e.target.value)}} border="none" borderBottom="2px solid var(--main-buttons-color)" borderRadius="none" _hover="var(--main-background-color)" outline="var(--main-buttons-color)"/>
            <IconButton display={{base:'flex'}} icon={<SearchIcon/>} isLoading={storeChat.loading} onClick={()=>{searchHendler(search, storeUser.userData.user._id)}} color="var(--main-buttons-color-text)" background="var(--main-buttons-color)"/>
            </Box>
            </FormControl>
            <Box width="100%" display="flex" flexWrap="wrap">
              {selectedUsers && selectedUsers.map((user) => (<UserTagItem key={user._id} user={user} handleFunction={()=>{searchDeletedHendler(user)}}/>))}
            </Box>
            {storeChat.loading ?
              <Spinner display="flex"/>
            : (
              storeChat.serchResult.map((user) => (<UserListItem key={user._id}
                  user={user} handleFunction={()=>{searchSelectedHendler(user)}}/>
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="var(--main-buttons-color-text)" background="var(--main-buttons-color)" width="100%" onClick={()=>{submitHandler(selectedUsers,groupChatName,storeUser.userData.user._id)}} isLoading={storeChat.loading}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
})
