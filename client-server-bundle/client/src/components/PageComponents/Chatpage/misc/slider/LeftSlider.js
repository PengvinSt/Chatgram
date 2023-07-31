import { SearchIcon } from '@chakra-ui/icons'
import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, IconButton, Input, Text, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '../../../../../App'
import ChatLoading from '../ChatLoading'
import UserListItem from '../userArrayMap/UserListItem'

export default observer(function LeftSlider() {
    const { isOpen, onOpen, onClose} = useDisclosure()
    const [search, setSearch] = useState("")
    const {storeUser, storeChat} = useContext(Context)
    const toast = useToast()

    const searchHendler = async (search,loggedUserId) =>{
        if(!search){
            toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            }); 
            storeChat.setLoading(false)
            return
        }
        storeChat.searchHendler(search,loggedUserId)
    }
  return (
    <>
    <Button variant='ghost' onClick={onOpen} color="var(--main-buttons-color-text)" background="var(--main-buttons-color)">
        <i className="fas fa-search"></i>
        <Text display={{base:"none",md:"flex"}} px="4">
            Search User
        </Text>
    </Button>

    <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
    <DrawerOverlay />
    <DrawerContent background="var(--main-background-color)"  color="var(--main-text-color)" border="1px solid var(--main-buttons-color)">
    <DrawerCloseButton onClick={()=>{setSearch("");storeChat.setSerchResult([])}}/>
    <DrawerHeader>Search user</DrawerHeader>
    <DrawerBody>
        <Box display='flex' pb={2}>
            <Input placeholder="Search by username..." marginRight={2} value={search} onChange={(e)=>{setSearch(e.target.value)}} border="none" borderBottom="2px solid var(--main-buttons-color)" borderRadius="none" _hover="var(--main-background-color)" outline="var(--main-buttons-color)"/>
            <IconButton display={{base:'flex'}} icon={<SearchIcon/>} onClick={()=>{searchHendler(search, storeUser.userData.user._id)}} isLoading={storeChat.loading} color="var(--main-buttons-color-text)" background="var(--main-buttons-color)"/>
        </Box>
        <Box>
            {!storeChat.loading 
                ? storeChat.serchResult.length > 0
                    ? storeChat.serchResult.map((user,i)=>
                    <UserListItem user={user} loading={storeChat.loadingChat} key={user._id} handleFunction={()=>{storeChat.accessChat(user._id,storeUser.userData.user._id); onClose();setSearch("")}}/>
                    )
                    : <Text width='100%' textAlign='center' margin='10px' fontSize='xl'> No info</Text>
                :   <ChatLoading/>}         
        </Box>
    </DrawerBody>
    <DrawerFooter>
        <Button width='100%'  color="var(--main-buttons-color-text)" background="var(--main-buttons-color)" mr={3} onClick={()=>{onClose();setSearch("");storeChat.setSerchResult([])}}>
            Cancel
        </Button>
    </DrawerFooter>
    </DrawerContent>
    </Drawer>
    </>
  )
})
