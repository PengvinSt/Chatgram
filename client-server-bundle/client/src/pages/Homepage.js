import React, { useContext, useState } from 'react'
import {Box, Container, Text, Button} from '@chakra-ui/react'
import Login from '../components/PageComponents/Homepage/Authentication/Login'
import Signup from '../components/PageComponents/Homepage/Authentication/Signup'
import { Context } from '../App'
import { observer } from 'mobx-react-lite'

export default observer(function Homepage() {
  const [reg, setReg] = useState(false)
  
  const { storeChat } = useContext(Context)
  return (
    <Container maxW="xl" centerContent background="var(--main-background-color)">
      <Box display="flex" justifyContent="center" padding="3" background="var(--main-message-color)" width="100%" margin="40px 0 15px 0" borderRadius="2xl" border="2px solid var(--main-buttons-color)">
        <Text fontSize="4xl" fontFamily="Montserrat" color="var(--main-text-color)">
          Chatgram
        </Text>
        <input type="checkbox" id="theme" className="null"/>
        <label htmlFor="theme" className="theme-label" onClick={()=>{storeChat.setTheme(!storeChat.theme)}}>
          {storeChat.theme
           ?<i className="fa-solid fa-sun"></i>
           :<i className="fa-solid fa-moon"></i>
          }
        </label>
      </Box>
      <Box background="var(--main-message-color)" width="100%" padding="20px" borderRadius="2xl" border="2px solid var(--main-buttons-color)">
        {reg 
        ?<Signup/>
        :<Login/>
        }
        <Box marginTop="10px" display="flex" justifyContent="center" alignItems="center">
        <Text color="var(--main-text-color)">
          {reg 
          ? "Already have an account?"
          : "Don't have an account?"
          }
        </Text>
        <Button marginLeft="5px" onClick={()=>{setReg(!reg)}} variant='ghost' color="var(--main-buttons-color)">
        {reg 
          ? "Login"
          : "Sign up"
          }
        </Button>
        </Box>
      </Box>      
    </Container>
  )
})
