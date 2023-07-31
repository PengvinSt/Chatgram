import { FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import { Button } from "@chakra-ui/button";
import React, { useContext, useState } from 'react'
import { useToast } from "@chakra-ui/toast";
import { observer } from 'mobx-react-lite'
import { Context } from '../../../../App';
import api from '../../../../http/core';



export default observer(function Signup() {
    const toast = useToast();
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmpassword, setConfirmpassword] = useState()
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const {storeUser} = useContext(Context)

    
   const submitHandler = async ()=>{
        setLoading(true);
        if (!name || !email || !password || !confirmpassword) {
        toast({
            title: "Please Fill all the Feilds",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
        setLoading(false);
        return;
        }
        if(password !== confirmpassword){
            toast({
                title: "Password is not match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            }); 
            setLoading(false);
            return;  
        }
        try {
              const pic = ''
              const { data } = await api.post("/user/register",{ name,email,password, pic});
              toast({
                title: "Registration Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              storeUser.setUserData(data)
              console.log(data)
              storeUser.setAuth(true)
        } catch (error) {
            toast({
                title: `${error.response.data.message}`,
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            }); 
            setLoading(false);
            return;  
        }
        setLoading(false);
    }


  return (
    <VStack spacing='15px' color="var(--main-text-color)">
        <FormControl id='first-name' isRequired>
            <FormLabel fontFamily="Montserrat">Name</FormLabel>
            <Input placeholder='Enter your name' onChange={(e)=>{setName(e.target.value)}} border="none" borderBottom="2px solid var(--main-buttons-color)" borderRadius="none" _hover="var(--main-background-color)" outline="var(--main-buttons-color)"/>
        </FormControl>
        <FormControl id='email-singup' isRequired>
            <FormLabel fontFamily="Montserrat">Email</FormLabel>
            <Input placeholder='Enter your email' onChange={(e)=>{setEmail(e.target.value)}} border="none" borderBottom="2px solid var(--main-buttons-color)" borderRadius="none" _hover="var(--main-background-color)" outline="var(--main-buttons-color)"/>
        </FormControl>
        <FormControl id='password-singup' isRequired>
            <FormLabel fontFamily="Montserrat">Password</FormLabel>
            <InputGroup>
            <Input type={show ? 'text' : 'password'} placeholder='Enter your password' onChange={(e)=>{setPassword(e.target.value)}} border="none" borderBottom="2px solid var(--main-buttons-color)" borderRadius="none" _hover="var(--main-background-color)" outline="var(--main-buttons-color)"/>
            <InputRightElement width="4.5rem">
            <Button height='1.75rem' size='sm' color="var(--main-buttons-color-text)" background="var(--main-buttons-color)" onClick={()=>{setShow(!show)}}>
                {show ? 'Hide' : 'Show'}
            </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id='password-singup-repeat' isRequired>
            <FormLabel fontFamily="Montserrat">Confirm Password</FormLabel>
            <InputGroup>
            <Input type={show ? 'text' : 'password'} placeholder='Enter your password' onChange={(e)=>{setConfirmpassword(e.target.value)}} border="none" borderBottom="2px solid var(--main-buttons-color)" borderRadius="none" _hover="var(--main-background-color)" outline="var(--main-buttons-color)"/>
            <InputRightElement width="4.5rem">
            <Button height='1.75rem' size='sm' color="var(--main-buttons-color-text)" background="var(--main-buttons-color)" onClick={()=>{setShow(!show)}}>
                {show ? 'Hide' : 'Show'}
            </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>
        <Button color="var(--main-buttons-color-text)" background="var(--main-buttons-color)" width='60%' onClick={submitHandler} isLoading={loading}>Sign Up</Button>
    </VStack>
  )
})
