import React, { useState } from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from "@chakra-ui/react"
import axios from 'axios'
import { POST_CONFIG, REQUEST_URL } from '../../url'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [show, setShow] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState("")
    const [avatar, setAvatar] = useState("")

    const [loading, setLoading] = useState(false)

    const imageChangeHandler = (e) => {
        const reader = new FileReader()
        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatar(reader.result)
            }
        }
        reader.readAsDataURL(e.target.files[0])
    }

    const toast = useToast()
    const navigate = useNavigate()

    const submitHandler = async () => {
        setLoading(true);
        if (password !== confirmPassword) {
            toast({
                title: "error",
                description: "confirm password is wrong",
                status: "error",
                isClosable: true,
                duration: 3000,
                position: "top-right"
            })
            setLoading(false);
            return;
        }
        try {
            const { data } = await axios.post(`${REQUEST_URL}/signup`, {
                name, email, password, avatar
            }, POST_CONFIG);
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
            setName("")
            setAvatar("")
            setPassword("")
            setConfirmPassword("")
            setLoading(false);
            navigate("/chats")
        } catch (error) {
            toast({
                title: "error",
                description: error.response ? error.response.data.message : error.message,
                status: "error",
                isClosable: true,
                duration: 3000,
                position: "top-right"
            })
            setLoading(false);
        }
        setLoading(false);
    };

    return (
        <VStack spacing={"5px"}>

            <FormControl mt="10px" isRequired>
                <FormLabel>Name</FormLabel>
                <Input type='text' id='name' placeholder='Enter Your Name' value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>

            <FormControl mt="10px" isRequired>
                <FormLabel>Email</FormLabel>
                <Input type='text' id='email' placeholder='Enter Your Email Id' value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>

            <FormControl mt="10px" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show ? 'text' : 'password'} id='password' placeholder='Enter Your Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <InputRightElement width={"4.5rem"}>
                        <Button onClick={() => setShow(!show)} h={"1.75rem"} size={"sm"}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl mt="10px" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input type={show ? 'text' : 'password'} id='confirm-password' placeholder='Enter Your Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <InputRightElement width={"4.5rem"}>
                        <Button onClick={() => setShow(!show)} h={"1.75rem"} size={"sm"}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl mt="10px">
                <FormLabel>Upload Your Picture</FormLabel>
                <Input
                    type='file'
                    p={1.5}
                    accept='image/*'
                    onChange={imageChangeHandler}
                />
            </FormControl>

            <Button isLoading={loading} isDisabled={!email || !password || !name || !confirmPassword} colorScheme='blue' width={"100%"} style={{ marginTop: 15 }} onClick={submitHandler}>
                Sign Up
            </Button>
        </VStack>
    )
}

export default SignUp