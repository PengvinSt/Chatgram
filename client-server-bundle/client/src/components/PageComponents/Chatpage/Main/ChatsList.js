import React, { useContext, useEffect, useState} from 'react'
import { Context } from '../../../../App'
import { observer } from 'mobx-react-lite'
import { Avatar, AvatarBadge, Box, Button, IconButton, Stack, Text } from '@chakra-ui/react'
import { AddIcon, ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons'
import ChatLoading from '../misc/ChatLoading'
import GroupChatModal from '../misc/Modals/CreatingGroupChatModal'


export default observer(function ChatsList({fetchAgain}) {
  const {storeChat, storeUser} = useContext(Context)
  const [hide, setHide] = useState(false)
  const getSender =(loggedUser, users) =>{
    // console.log(loggedUser,users)
    return users[0]._id === loggedUser._id ? users[1] : users[0];
  }
  const isOnline = (loggedUser, users, isOnlineUser) =>{
   const user =  getSender(loggedUser,users)
   const online = isOnlineUser.find(userOnline => userOnline.userId === user._id)
    if(online){
      return true
    }else{
      return false
    }
  }
  useEffect(()=>{
    storeChat.getUserChats(storeUser.userData.user._id)
    
    // eslint-disable-next-line
  },[fetchAgain])
  
  return (
    <>
    {hide 
    ?<Box  display="flex" flexDir="column" gap="10px" justifyContent="center" alignItems="center" padding={3} background="var(--main-background-color)"  color="var(--main-text-color)" width="81px" borderRadius="lg" border="1px solid var(--main-buttons-color)">
      <Box display="flex" flexDir='column' gap="5px">
      <GroupChatModal>
        <IconButton display="flex" fontSize="20px"icon={<AddIcon />} background="var(--main-buttons-color)"  color="var(--main-buttons-color-text)"/>
      </GroupChatModal>
      <IconButton display="flex" fontSize="20px"icon={<ArrowRightIcon />} onClick={()=>{setHide(!hide)}} background="var(--main-buttons-color)"  color="var(--main-buttons-color-text)"/>
      </Box>
      <Box display="flex" flexDir="column" width="100%" height="100%" borderRadius="lg" overflowY="hidden" background="var(--main-background-color)"  color="var(--main-text-color)">
      {storeChat.chatsData 
      &&<Stack overflowY='scroll' overflowX="hidden">
        {storeChat.chatsData.map(chat=>(
          <Box cursor="pointer" width="55px" height="55px" borderRadius="full" display="flex" justifyContent="center" alignItems="center" background={storeChat.selectedChatsData._id === chat._id ? "var(--main-hover)" : "var(--main-message-color)"} color="var(--main-text-color)" border="1px solid var(--main-buttons-color)" onClick={() =>{ storeChat.setSelectedChatsData(chat);storeChat.deleteNotifications(chat)}} key={chat._id}>
            {!chat.isGroupChat
            ?<Avatar size="md" cursor="pointer" name={getSender(storeUser.userData.user, chat.users).name} src={getSender(storeUser.userData.user, chat.users).pic} >
            {isOnline(storeUser.userData.user, chat.users, storeChat.isOnlineUser) 
            ?<AvatarBadge boxSize='1.25em' bg='green.500'/>
            : null}
            </Avatar>
            :<Avatar size="md" cursor="pointer" name={chat.chatName} src={chat.pic} />
            }
          </Box>
        ))}       
      </Stack>
      }
      </Box>
    </Box>

    :<Box display="flex" flexDir="column" alignItems="center" padding={3} background="var(--main-background-color)"  color="var(--main-text-color)" width={{ base: "100%", md: "31%" }} borderRadius="lg" border="1px solid var(--main-buttons-color)">
    <Box paddingBottom="3px" paddingLeft="3px" paddingRight="3px" fontSize={{ base: "28px", md: "30px" }} fontFamily="Montserrat" display="flex" width="100%" justifyContent="space-between" alignItems="center" background="var(--main-background-color)"  color="var(--main-text-color)">
      Chats
      <Box display="flex" gap="5px">
      <GroupChatModal>
        <Button display={{base:'none', lg:'flex'}} fontSize="14px" rightIcon={<AddIcon />} background="var(--main-buttons-color)"  color="var(--main-buttons-color-text)">
        <Text>
        Group Chat
        </Text>
        </Button>
        <IconButton display={{base:'flex', lg:'none'}} fontSize="14px"icon={<AddIcon />} background="var(--main-buttons-color)"  color="var(--main-buttons-color-text)"/>
      </GroupChatModal>
      <IconButton display="flex" fontSize="14px"icon={<ArrowLeftIcon />} onClick={()=>{setHide(!hide)}} background="var(--main-buttons-color)"  color="var(--main-buttons-color-text)"/>
      </Box>
    </Box>
  <Box display="flex" flexDir="column" padding="3px" width="100%" height="100%" borderRadius="lg" overflowY="hidden" background="var(--main-background-color)"  color="var(--main-text-color)">
      {storeChat.chatsData
      ? <Stack overflowY='scroll'>
          {storeChat.chatsData.map(chat=>(
            <Box cursor="pointer" padding='3px 2px' borderRadius="lg" background={storeChat.selectedChatsData._id === chat._id ? "var(--main-hover)" : "var(--main-message-color)"} color="var(--main-text-color)" border="1px solid var(--main-buttons-color)" onClick={() =>{ storeChat.setSelectedChatsData(chat);storeChat.deleteNotifications(chat)}} key={chat._id}>
              <Text>
                {!chat.isGroupChat
                  ? <Box display="flex" alignItems="center" gap="10px">
                    <Avatar marginRight={2} size="sm" cursor="pointer" name={getSender(storeUser.userData.user, chat.users).name} src={getSender(storeUser.userData.user, chat.users).pic} >
                      {isOnline(storeUser.userData.user, chat.users, storeChat.isOnlineUser) 
                      ?<AvatarBadge boxSize='1.25em' bg='green.500'/>
                      : null}
                    </Avatar>
                    <Box>
                      <Text>{getSender(storeUser.userData.user, chat.users).name}</Text>
                      {!chat.latestMessage 
                    ? <Text>No message already send</Text>
                    : chat.latestMessage.content.includes("localhost:5000")
                      ? <Text>{chat.latestMessage.sender.name !== storeUser.userData.user.name && `${chat.latestMessage.sender.name} : ` }image</Text>
                      :chat.latestMessage && <Text>{chat.latestMessage.sender.name !== storeUser.userData.user.name && `${chat.latestMessage.sender.name} : ` }{chat.latestMessage.content.length > 20 
                        ? `${chat.latestMessage.content.slice(0,20)} ...`
                        : chat.latestMessage.content
                      }</Text>
                    }
                    </Box>
                  </Box>
                  :<Box display="flex" alignItems="center" gap="10px">
                  <Avatar marginRight={2} size="sm" cursor="pointer" name={chat.chatName} src={chat.pic} />
                  <Box display="flex" flexDir="column">
                    <Text>{chat.chatName}</Text>
                    {!chat.latestMessage 
                    ? <Text>No message already send</Text>
                    : chat.latestMessage.content.includes("localhost:5000")
                      ? <Text>{chat.latestMessage.sender.name !== storeUser.userData.user.name && `${chat.latestMessage.sender.name} : ` }image</Text>
                      :chat.latestMessage && <Text>{chat.latestMessage.sender.name !== storeUser.userData.user.name && `${chat.latestMessage.sender.name} : ` }{chat.latestMessage.content.length > 20 
                        ? `${chat.latestMessage.content.slice(0,20)} ...`
                        : chat.latestMessage.content
                      }</Text>
                    }
                  </Box>
                  </Box>
                }
              </Text>
            </Box>
          ))}
        </Stack>
      : <ChatLoading/>
      }
    </Box>
    </Box>
    }
    </>
  )
})
