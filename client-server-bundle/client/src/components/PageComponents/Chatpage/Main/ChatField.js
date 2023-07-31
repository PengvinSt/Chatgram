import React, { useContext, useEffect, useState} from 'react'
import { Context } from '../../../../App'
import { Box, FormControl, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import ChatBoxDummy from '../misc/ChatBoxDummy'
import { AttachmentIcon } from '@chakra-ui/icons'
import ProfileModal from '../misc/Modals/ProfileModal'
import UpdatingGroupChatModal from '../misc/Modals/UpdatingGroupChatModal'
import api, { SERVER_URL } from '../../../../http/core'
import MessagesField from './MessagesField'
import io from 'socket.io-client'
import Lottie from "lottie-react";
import Typing from '../../../../materials/typingAnimation.json'
import RightSlider from '../misc/slider/RightSlider'

let socket;

export default observer(function ChatField({fetchAgain,setFetchAgain}) {
    const {storeChat, storeUser} = useContext(Context)
    const [newMessage, setNewMessage] = useState('')
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    // const [newPic, setNewPic] = useState(null)
    const toast =useToast()

    const getSender =(loggedUser, users) =>{
        // console.log(loggedUser,users) 
        // console.log({users})
        // console.log(users[0]._id === loggedUser._id ? users[1] : users[0])
        return users[0]._id === loggedUser._id ? users[1] : users[0];
    }
    useEffect(()=>{
        socket = io(SERVER_URL, {
            extraHeaders:{
                userId: storeUser.userData.user._id
            }
        })
        // socket.emit("setup", storeUser.userData.user) 
        socket.on("Connected", () => setSocketConnected(true));
        socket.on('Typing',(room)=>{ if(room === storeChat.selectedChatsData._id) setIsTyping(true) })
        socket.on('NotTyping',()=>{setIsTyping(false)})
        // eslint-disable-next-line
    },[])

    useEffect(()=>{
        if(storeChat.selectedChatsData._id !== undefined){
            socket.emit("ChatStart", storeChat.selectedChatsData._id)
        }
        // eslint-disable-next-line
    },[storeChat.selectedChatsData])

    
    useEffect(()=>{   
        socket.on("GetMessage",(message)=>{
            if(storeChat.selectedChatsData._id !== message.chat._id){
                if(!storeChat.notifications.includes(message)){
                    // console.log(message)
                    storeChat.setNotifications([message,...storeChat.notifications])
                    // console.log(storeChat.notifications)
                    setFetchAgain(!fetchAgain)
                }
            }else{
                storeChat.addMessages(message)
            }
        })
        socket.on("getOnlineUsers", (activeUsers)=>{
            storeChat.setIsOnlineUser(activeUsers)
            setFetchAgain(!fetchAgain)
        });
        socket.on('SendMessageError',(error)=>{
            toast({
                title: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
            storeChat.setloadingChatBox(true)
            setFetchAgain(!fetchAgain)
            storeChat.setDummySelectedChatsData()
            storeChat.setloadingChatBox(false)
        })
        
        return () => {
            socket.off("GetMessage");
            socket.off("SendMessageError")
        }
        
        // eslint-disable-next-line
    },[storeChat.messages])

    useEffect(()=>{
        storeChat.getMessages()

        // eslint-disable-next-line
    },[storeChat.selectedChatsData])

    const sendMessage = async(event,newMessage) =>{
        if(event.key === 'Enter' && newMessage){
            try {
                setNewMessage('')
               const {data} = await api.post('/message/', {content:newMessage, chatId:storeChat.selectedChatsData._id, loggedUserId:storeUser.userData.user._id})
               socket.emit("NotTyping", storeChat.selectedChatsData._id)
               socket.emit("SendMessage",data)
               storeChat.addMessages(data)
               setFetchAgain(!fetchAgain)
               setNewMessage('')
            } catch (error) {
                console.log(error)
            }
            
        }   
    }
    const timeHandler =(time) =>{
        // console.log(time) 2023-06-06T23:13:36.433Z
        let hours = time.split('T')[1].split('.')[0].split(':')[0]
        let minutes = time.split('T')[1].split('.')[0].split(':')[1]
        // let seconds = time.split('T')[1].split('.')[0].split(':')[2]
        let days = time.split('T')[0].split('-')
        hours = Number(hours) + 3 // UTC time +3:00
        if(hours > 24){
            hours = hours - 24
            days[2] = Number(days[2]) + 1
            if(days[2] <10){
                days[2] = `0${days[2]}`
            }
        }
        days = days.reverse().join('/')     
        return `${hours}:${minutes} (${days})`
    
    }
    const sendFileHandler = async (e) =>{
        console.log(e.target.files[0])
        try {
            const {data} = await api.post('/message/', {newPic:e.target.files[0], chatId:storeChat.selectedChatsData._id, loggedUserId:storeUser.userData.user._id},{
                headers:{
                    'content-type': 'multipart/form-data'
                }
            })
            socket.emit("SendMessage",data)
            storeChat.addMessages(data)
            setFetchAgain(!fetchAgain)
        } catch (error) {
            toast({
                title: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
        }  
    }

  return (
    <>{storeChat.selectedChatsData._id
    ? <>
        <Text fontSize="30px" padding="3" width="100%" fontFamily="Montserrat" display="flex" justifyContent="space-between" alignItems="center" background="var(--main-background-color)"  color="var(--main-text-color)">
            {/* <button onClick={()=>{console.log(socketConnected)}}>Click</button> */}
            {!storeChat.selectedChatsData.isGroupChat
            ?
            <>
                <Box>
                    {getSender(storeUser.userData.user, storeChat.selectedChatsData.users).name}
                    {getSender(storeUser.userData.user, storeChat.selectedChatsData.users).isOnline 
                    ? <Text fontSize="sm" color="greenyellow">Online</Text>
                    :  <Text fontSize="sm">Last seen at {timeHandler(getSender(storeUser.userData.user, storeChat.selectedChatsData.users).updatedAt)}</Text>
                    }
                </Box>
                <ProfileModal user={getSender(storeUser.userData.user, storeChat.selectedChatsData.users)} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
            </> 
            : 
            <>
                {storeChat.selectedChatsData.chatName}
                {storeUser.userData.user._id !== storeChat.selectedChatsData.groupAdmin._id 
                ? <RightSlider />
                :   <Box display="flex" justifyContent="center" alignItems="center" gap="5px">
                    <UpdatingGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
                    <RightSlider fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
                    </Box>           
                }
                    
            </>
            }
        </Text>
        <Box display="flex" flexDir="column" justifyContent="flex-end" padding={3} background="var(--main-background-color)"  color="var(--main-text-color)"  width="100%" height="100%" borderRadius="lg" overflowY="hidden" >
            {storeChat.loadingChatBox
            ? <Spinner alignSelf="center" size="xl" margin="auto"/>
            : <Box display='flex' flexDir='column' overflowY='scroll'>
                <MessagesField/>
            </Box>
            }
            
            <Box display="flex" alignItems="center">
            <Input id='file_upload_chat' display="none" marginBottom="10px" type='file' onChange={e=>{sendFileHandler(e)}} width="5%" border="none" borderBottom="2px solid var(--main-buttons-color)" borderRadius="none" _hover="var(--main-background-color)" outline="var(--main-buttons-color)"/>
            <label htmlFor="file_upload_chat" className='file_upload_chat'><AttachmentIcon boxSize="6"/></label>
            <FormControl onKeyDown={(event)=>{sendMessage(event,newMessage)}} marginTop={3} isRequired>
                {isTyping && <Lottie animationData={Typing} loop={true} style={{width:70, height:30, marginLeft:0, marginBottom:10}} />}
                <Input variant='filled' background="var(--main-background-color)"  color="var(--main-text-color)" border="1px solid var(--main-buttons-color)" _hover="var(--main-background-color)" outline="var(--main-buttons-color)" placeholder='Enter a message' value={newMessage} onChange={(e)=>{
                    setNewMessage(e.target.value);
                    if(!socketConnected) return;
                    if(!typing) {
                        setTyping(true)
                        socket.emit("Typing", storeChat.selectedChatsData._id)
                    };
                        let typingTimeoutData = new Date().getTime();
                        setTimeout(()=>{
                            let typingTimeoutDataNow = new Date().getTime()
                            let typingTimeoutDataDiff = typingTimeoutDataNow - typingTimeoutData;
                            if(typingTimeoutDataDiff >= 5000 && typing){
                                socket.emit("NotTyping", storeChat.selectedChatsData._id)
                                setTyping(false)
                            }
                        }, 5000)
                    }}/>
            </FormControl>
            </Box>
        </Box>
      </>
    :  <ChatBoxDummy/>
    }
    </>
  )
})
