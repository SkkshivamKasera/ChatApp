import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { useChatState } from '../../context/ChatProvider'
import { Box, Button, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../../config/ChatLogics'
import ProfileModal from './ProfileModal'
import UpdateGroupChatModal from './UpdateGroupChatModal'
import { RiSendPlane2Fill } from 'react-icons/ri'
import axios from 'axios'
import { GET_CONFIG, POST_CONFIG, REQUEST_URL } from '../../url'
import ScrollableChat from './ScrollableChat'
import io from 'socket.io-client'

const END_POINT = "https://chat-app-t024.onrender.com"
let socket, selectChatComaprare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState("")
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const { user, selectChat, setSelectChat, notification, setNotification } = useChatState()
    const toast = useToast()

    const typingHandler = (e) => {
        setNewMessage(e.target.value)
        if (!socketConnected) {
            return;
        }
        if (!typing) {
            setTyping(true)
            socket.emit("typing", selectChat._id)
        }
        let lastTypingTime = new Date().getTime()
        let timerLength = 3000
        setTimeout(() => {
            let timeNow = new Date().getTime()
            let timeDiff = timeNow - lastTypingTime
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectChat._id)
                setTyping(false)
            }
        }, timerLength)
    }

    const fetchAllMessages = useCallback(async () => {
        setLoading(true)
        if (!selectChat) {
            return
        }
        try {
            const { data } = await axios.get(`${REQUEST_URL}/message/${selectChat._id}`, GET_CONFIG)
            setMessages(data?.messages)
            socket.emit("join chat", selectChat._id);
        } catch (error) {
            toast({
                title: "error",
                description: error.response ? error.response.data.message : error.message,
                status: "error",
                position: "top-right",
                duration: 3000,
                isClosable: true
            })
        }
        setLoading(false)
    }, [selectChat, toast])

    const sendMessage = async () => {
        if (!newMessage) {
            return
        }
        try {
            const { data } = await axios.post(`${REQUEST_URL}/message/send`, {
                content: newMessage,
                chatId: selectChat?._id
            }, POST_CONFIG)
            socket.emit("new message", data.message)
            setMessages([...messages, data?.message])
        } catch (error) {
            toast({
                title: "error",
                description: error.response ? error.response.data.message : error.message,
                status: "error",
                position: "top-right",
                duration: 3000,
                isClosable: true
            })
        }
        setNewMessage("")
    }

    useEffect(() => {
        socket = io(END_POINT)
        socket.emit("setup", user)
        socket.on("connected", () => {
            setSocketConnected(true)
        })
        socket.on("typing", () => setIsTyping(true))
        socket.on("stop typing", () => setIsTyping(false))
    }, [user])

    useEffect(() => {
        socket.on("message received", (newMessageRecieved) => {
            if (!selectChatComaprare || selectChatComaprare?._id !== newMessageRecieved?.chat?._id) {
                if(!notification.includes(newMessageRecieved)){
                    setNotification([newMessageRecieved, ...notification])
                    setFetchAgain(!fetchAgain)
                }
            }
            setMessages([...messages, newMessageRecieved])
        })
    })

    useEffect(() => {
        fetchAllMessages()
        selectChatComaprare = selectChat
    }, [selectChat, fetchAllMessages])

    return (
        <Fragment>
            {
                selectChat ? (
                    <Fragment>
                        <Text
                            fontSize={{ base: "28px", md: "30px" }}
                            pb={3}
                            px={2}
                            w={"100%"}
                            display={"flex"}
                            justifyContent={{ base: "space-between" }}
                            alignItems={"center"}
                            color={"black"}
                        >
                            <IconButton
                                display={{ base: "flex", md: "none" }}
                                icon={<ArrowBackIcon />}
                                onClick={() => setSelectChat("")}
                            />
                            {
                                !selectChat.isGroupChat ? (
                                    <Fragment>
                                        {getSender(user, selectChat.users)?.toUpperCase()}
                                        <ProfileModal user={getSenderFull(user, selectChat.users)} />
                                    </Fragment>
                                ) : (
                                    <Fragment>
                                        {selectChat.chatName.toUpperCase()}
                                        <UpdateGroupChatModal
                                            fetchAgain={fetchAgain}
                                            setFetchAgain={setFetchAgain}
                                        />
                                    </Fragment>
                                )
                            }
                        </Text>
                        <Box
                            display={"flex"}
                            flexDir={"column"}
                            justifyContent={"flex-end"}
                            p={3}
                            bg={"#E8E8E8"}
                            w={"100%"}
                            h={"100%"}
                            borderRadius={"lg"}
                            overflowY={"hidden"}
                        >
                            {
                                loading ? (
                                    <Spinner
                                        size={"xl"}
                                        w={20}
                                        h={20}
                                        alignSelf={"center"}
                                        margin={"auto"}
                                    />
                                ) : (
                                    <div className='messages'>
                                        <ScrollableChat messages={messages} />
                                    </div>
                                )
                            }
                            <FormControl position={"relative"}>
                                {isTyping && <span>Typing...</span>}
                                <Input
                                    variant={"filled"}
                                    bg={"#E0E0E0"}
                                    placeholder='Enter a message...'
                                    value={newMessage}
                                    onChange={(e) => typingHandler(e)}
                                />
                                <Button
                                    colorScheme={"blue"}
                                    borderLeft={0}
                                    position={"absolute"}
                                    right={0}
                                    isDisabled={!newMessage}
                                    onClick={sendMessage}
                                >
                                    <RiSendPlane2Fill />
                                </Button>
                            </FormControl>
                        </Box>
                    </Fragment>
                ) : (
                    <Box
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        h={"100%"}
                    >
                        <Text fontSize={"3xl"} pb={3}>
                            Click on a user to start chatting
                        </Text>
                    </Box>
                )
            }
        </Fragment>
    )
}

export default SingleChat
