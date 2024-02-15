import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { useChatState } from "../../context/ChatProvider"
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { GET_CONFIG, REQUEST_URL } from '../../url'
import { AddIcon } from '@chakra-ui/icons'
import ChatLoading from './ChatLoading'
import { getSender } from '../../config/ChatLogics'
import GroupChatModal from './GroupChatModal'

const MyChats = ({fetchAgain}) => {
    const [loggedUser, setLoggedUser] = useState()

    const { selectChat, setSelectChat, chats, setChats } = useChatState()

    const toast = useToast()

    const fetchChat = useCallback(async () => {
        try {
            const { data } = await axios.get(`${REQUEST_URL}/chat`, GET_CONFIG)
            setChats(data.chat)
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
    }, [setChats, toast])

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("user")))
        fetchChat()
    }, [fetchAgain, fetchChat])


    return (
        <Fragment>
            <Box
                display={{ base: selectChat ? "none" : "flex", md: "flex" }}
                flexDir={"column"}
                alignItems={"center"}
                p={3}
                bg={"white"}
                w={{ base: "100%", md: "31%" }}
                borderRadius={"lg"}
                borderWidth={"1px"}
            >
                <Box
                    pb={3}
                    px={3}
                    fontSize={{ base: "28px", md: "30px" }}
                    display={"flex"}
                    w={"100%"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    My Chats
                    <GroupChatModal>
                        <Button
                            display={"flex"}
                            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                            rightIcon={<AddIcon />}
                        >
                            New Group Chat
                        </Button>
                    </GroupChatModal>
                </Box>
                <Box
                    display={"flex"}
                    flexDir={"column"}
                    p={3}
                    bg={"#F8F8F8"}
                    w={"100%"}
                    h={"100%"}
                    borderRadius={"lg"}
                    overflowY={"hidden"}
                >
                    {
                        chats ? (
                            <Stack overflowY={"scroll"}>
                                {
                                    chats.map((chat) => (
                                        <Box
                                            onClick={() => setSelectChat(chat)}
                                            cursor={"pointer"}
                                            bg={selectChat === chat ? "#38B2AC" : "#E8E8E8"}
                                            color={selectChat === chat ? "white" : "black"}
                                            px={3}
                                            py={2}
                                            borderRadius={"lg"}
                                            key={chat._id}
                                        >
                                            <Text>
                                                {!chat.isGroupChat ? (getSender(loggedUser, chat.users)) : (chat.chatName)}
                                            </Text>
                                        </Box>
                                    ))
                                }
                            </Stack>
                        ) : (
                            <ChatLoading />
                        )
                    }
                </Box>
            </Box>
        </Fragment>
    )
}

export default MyChats
