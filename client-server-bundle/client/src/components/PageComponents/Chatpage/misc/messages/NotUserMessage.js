import { Avatar, AvatarBadge, Box } from '@chakra-ui/react'
import React, { useContext } from 'react'
import './Message.css'
import PhotoModal from '../Modals/PhotoModal'
import { Context } from '../../../../../App'


export default function NotUserMessage({message, index}) {
  
  const {storeChat} = useContext(Context)

  const timeHandler =(time) =>{
    let hours = time.split('T')[1].split('.')[0].split(':')[0]
    let minutes = time.split('T')[1].split('.')[0].split(':')[1]
    // let seconds = time.split('T')[1].split('.')[0].split(':')[2] 15:57:07
    hours = Number(hours) + 3 // UTC time +3:00 
    if(hours > 24){
      hours = hours - 24
    }     
    return `${hours}:${minutes}`

  }

  const isLastHandler = (messages, message, index) => {
    if(index < messages.length - 1){
      if(messages[index + 1].sender._id !== message.sender._id || messages[index + 1].sender._id === undefined){
        return true
      }else{
        return false
      }
    }else{
      return true
    }
  }

  const isOnline = (user, isOnlineUser) =>{
    const online = isOnlineUser.find(userOnline => userOnline.userId === user._id)
     if(online){
       return true
     }else{
       return false
     }
   }

  return (
    <div className="chat_message">
      {isLastHandler(storeChat.messages,message,index) 
        ? message.content.includes("localhost:5000")
            ?<Avatar name={message.sender.name} src={message.sender.pic} border='1px solid black' marginTop="150px" marginRight="10px">
              {isOnline(message.sender, storeChat.isOnlineUser) 
              ?<AvatarBadge boxSize='1.25em' bg='green.500'/>
              : null}
              </Avatar>
            : <Avatar name={message.sender.name} src={message.sender.pic} border='1px solid black'>
              {isOnline(message.sender, storeChat.isOnlineUser) 
              ?<AvatarBadge boxSize='1.25em' bg='green.500'/>
              : null}
              </Avatar>
        : <Box width="50px"></Box>
        }
        <div className="not_user_container">
        {message.chat.isGroupChat && <span><>{message.sender.name}</></span>}
        {message.content.includes("localhost:5000")
        ?<PhotoModal image={message.content}><img className="user_msg_img" src={message.content} alt="msg"/></PhotoModal>
        :<div className="user_msg">{message.content}</div>
        }
        </div>
        {message.chat.isGroupChat 
        ?message.content.includes("localhost:5000")
          ?<div className="img_time_nu">{timeHandler(message.createdAt)}</div>
          :<div className='time'>{timeHandler(message.createdAt)}</div>
        :message.content.includes("localhost:5000")
          ?<div className="img_time_nu">{timeHandler(message.createdAt)}</div>
          :<div>{timeHandler(message.createdAt)}</div>
        }
        
    </div>
  )
}

