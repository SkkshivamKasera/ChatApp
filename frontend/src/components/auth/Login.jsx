import { Button, FormControl, FormLabel, Input, VStack, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { POST_CONFIG, REQUEST_URL } from '../../url'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const toast = useToast()
    const navigate = useNavigate()

    const submitHandler = async () => {
        setLoading(true)
        try{
            const { data } = await axios.post(`${REQUEST_URL}/login`, {
                email, password
            }, POST_CONFIG)
            toast({
                title: "success",
                description: data.message,
                status: "success",
                isClosable: true,
                duration: 3000,
                position: "top-right"
            })
            localStorage.setItem("user", JSON.stringify(data.user))
            setEmail("")
            setPassword("")
            navigate("/chats")
        }catch (error) {
            toast({
                title: "error",
                description: error.response ? error.response.data.message : error.message,
                status: "error",
                isClosable: true,
                duration: 3000,
                position: "top-right"
            })
        }
        setLoading(false)
    }

    return (
        <VStack spacing={"5px"}>
            <FormControl mt="10px" isRequired>
                <FormLabel>Email</FormLabel>
                <Input type='text' id='login-email' placeholder='Enter Your Email Id' value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>

            <FormControl mt="10px" isRequired>
                <FormLabel>Password</FormLabel>
                <Input type='password' id='login-password' placeholder='Enter Your Password' value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>

            <Button onClick={submitHandler} colorScheme='blue' isLoading={loading} width={"100%"} isDisabled={!email || !password} style={{ marginTop: 15 }}>
                Login
            </Button>

            <Button
                variant={"solid"}
                colorScheme='red'
                width={"100%"}
                onClick={() => {
                    setEmail("guest@example.com")
                    setPassword("12345")
                }}
            >
                Get Guest User Credentials
            </Button>
        </VStack>
    )
}

export default Login
