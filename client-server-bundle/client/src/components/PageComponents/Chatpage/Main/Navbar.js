import { Avatar, Box, Button, Menu, MenuButton, MenuList, Text, Tooltip, MenuItem, MenuDivider} from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useContext} from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '../../../../App';
import ProfileModal from '../misc/Modals/ProfileModal';
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';
import LeftSlider from '../misc/slider/LeftSlider';

export default observer(function Navbar() {
    const {storeUser, storeChat} = useContext(Context)
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" background="var(--main-background-color)"  color="var(--main-text-color)" width="100%" padding="5px 10px 5px 10px" border="5px solid var(--main-background-color)">
        <Tooltip label='Search Users to chat' hasArrow placement='bottom-end'>
            <LeftSlider/>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Montserrat" background="var(--main-background-color)"  color="var(--main-text-color)">
          Chatgram
        </Text>
        <Box display="flex" alignItems="center" background="var(--main-background-color)"  color="var(--main-text-color)">
        <input type="checkbox" id="theme" className="null"/>
        <label htmlFor="theme" className="theme-label" onClick={()=>{storeChat.setTheme(!storeChat.theme)}}>
          {storeChat.theme
           ?<i className="fa-solid fa-moon"></i>
           :<i className="fa-solid fa-sun"></i>
          }
        </label>
        <Box>
            <Menu>
                <MenuButton padding="1">
                    <NotificationBadge count={storeChat.notifications.length} effect={Effect.SCALE}/>
                    <BellIcon fontSize="2xl" margin="1"/>
                </MenuButton>
                <MenuList background="var(--main-background-color)"  color="var(--main-text-color)" border="1px solid var(--main-buttons-color)">
                    {storeChat.notifications.length>0 
                    ? storeChat.notifications.map((notification,i)=>
                    <MenuItem key={i} background="var(--main-background-color)">
                        {notification.chat.isGroupChat
                        ? <Box display='flex' width="100%" onClick={()=>{storeChat.setSelectedChatsData(notification.chat);storeChat.deleteNotifications(notification)}} borderRadius="15px" color="var(--main-buttons-color-text)" background="var(--main-buttons-color)">
                            <MenuDivider/>
                            <Avatar name={notification.chat.chatName} src={notification.chat.pic} size="md" margin="auto" marginRight="5px"/>
                            <Box display='flex' flexDir='column' width="100%">
                                <Text  textAlign="start" fontSize="1.2em">{notification.chat.chatName}</Text>
                                <Box display='flex' flexDir='raw'><Text textAlign="center">{notification.sender.name}: </Text>
                                {notification.content.includes("localhost:5000")
                                    ? <Text paddingLeft="4px" color="red">Image</Text>
                                    :notification && <Text>{notification.content.length > 20 
                                    ? `${notification.content.slice(0,20)} ...`
                                    : notification.content
                                    }</Text>
                                }
                                </Box>
                            </Box>
                            <MenuDivider/>
                        </Box>
                        : <Box display='flex' width="100%" onClick={()=>{storeChat.setSelectedChatsData(notification.chat);storeChat.deleteNotifications(notification)}} borderRadius="15px" color="var(--main-buttons-color-text)" background="var(--main-buttons-color)">
                            <MenuDivider/>
                            <Avatar name={notification.sender.name} src={notification.sender.pic} size="md" margin="auto" marginRight="5px"/>
                            <Box display='flex' flexDir='column' width="100%">
                            <Text  textAlign="start" fontSize="1.2em">{notification.sender.name}</Text>
                            {notification.content.includes("localhost:5000")
                                    ? <Text paddingLeft="4px" color="red">Image</Text>
                                    :notification && <Text>{notification.content.length > 20 
                                    ? `${notification.content.slice(0,20)} ...`
                                    : notification.content
                                    }</Text>
                            }
                            </Box>
                            <MenuDivider/>
                        </Box>
                        }
                    </MenuItem>)
                    :<Text padding="5px" textAlign="center">No new notifications</Text>
                    }
                    {storeChat.notifications.length > 0 && 
                    <MenuItem background="var(--main-background-color)">
                        <Button variant='solid' color="var(--main-buttons-color-text)" background="var(--main-buttons-color)" onClick={()=>{storeChat.clearNotifications()}} width='100%'>Clear</Button>
                    </MenuItem>
                    }
                </MenuList>
            </Menu>
            <Menu >
                <MenuButton as={Button} rightIcon={<ChevronDownIcon/>} color="var(--main-buttons-color-text)" background="var(--main-buttons-color)">
                        <Avatar size='sm' cursor='pointer' name={storeUser.userData.user.name} src={storeUser.userData.user.pic}/>
                </MenuButton>
                <MenuList background="var(--main-background-color)"  color="var(--main-text-color)" border="1px solid var(--main-buttons-color)">
                    <ProfileModal user={storeUser.userData.user}>
                            <MenuItem background="var(--main-background-color)">
                                My Profile
                            </MenuItem>
                    </ProfileModal>
                        <MenuDivider/>
                        <MenuItem background="var(--main-background-color)">
                            <Button variant='solid' colorScheme='red' onClick={()=>{storeUser.logout()}} width='100%'>Log out</Button>
                        </MenuItem>
                </MenuList>
            </Menu>
        </Box>
        </Box>        
    </Box>
  )
})
