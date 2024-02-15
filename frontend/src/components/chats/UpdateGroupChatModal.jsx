import React, { Fragment, useState } from 'react'
import { useDisclosure } from "@chakra-ui/hooks"
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { useChatState } from '../../context/ChatProvider'
import UserBadgeItem from "../useravatar/UserBadgeItem"
import axios from 'axios'
import { GET_CONFIG, POST_CONFIG, REQUEST_URL } from '../../url'
import UserListItem from '../useravatar/UserListItem'

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
    const [groupChatName, setGroupChatName] = useState()
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)

    const { user, selectChat, setSelectChat } = useChatState()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    const handleDelete = async (user_to_delete) => {
        if(selectChat?.groupAdmin?._id !== user?._id){
            toast({
                title: "warning",
                description: "only admin do this",
                status: "warning",
                position: "top-right",
                duration: 3000,
                isClosable: true
            })
            return
        }
        try{
            const { data } = await axios.put(`${REQUEST_URL}/chat/group/user/remove`, {
                chatId: selectChat?._id,
                userId: user_to_delete?._id
            }, POST_CONFIG)
            setSelectChat(data.removeUserInChat)
            setFetchAgain(!fetchAgain)
        }catch(error){
            toast({
                title: "error",
                description: error.response ? error.response.data.message : error.message,
                status: "error",
                position: "top-right",
                duration: 3000,
                isClosable: true
            })
        }
    }

    const handleRename = async () => {
        setRenameLoading(true)
        try {
            const { data } = await axios.put(`${REQUEST_URL}/chat/group/rename`, {
                chatId: selectChat._id,
                chatName: groupChatName
            }, POST_CONFIG)
            setSelectChat(data.updatedChat)
            setFetchAgain(!fetchAgain)
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
        setRenameLoading(false)
        setGroupChatName("")
    }

    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            return
        }
        try {
            setLoading(true)
            const { data } = await axios.get(`${REQUEST_URL}/user/all?search=${search}`, GET_CONFIG)
            setSearchResult(data.users)
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
    }

    const handleToAddFunction = async (userToAdd) => {
        if(selectChat?.users?.find((u) => u._id === userToAdd._id)){
            toast({
                title: "warning",
                description: "user already exists",
                status: "warning",
                position: "top-right",
                duration: 3000,
                isClosable: true
            })
            return
        }
        try{
            const { data } = await axios.put(`${REQUEST_URL}/chat/group/user/add`, {
                chatId: selectChat?._id,
                userId: userToAdd?._id
            }, POST_CONFIG)
            setSelectChat(data?.addedUserInChat)
            setFetchAgain(!fetchAgain)
        }catch(error){
            toast({
                title: "error",
                description: error.response ? error.response.data.message : error.message,
                status: "error",
                position: "top-right",
                duration: 3000,
                isClosable: true
            })
        }
    }

    const handleRemove = async () => {
        try{
            const { data } = await axios.put(`${REQUEST_URL}/chat/group/user/remove`, {
                chatId: selectChat._id,
                userId: user?._id
            }, POST_CONFIG)
            setSelectChat(data.updatedChat)
            setFetchAgain(!fetchAgain)
        }catch(error){
            toast({
                title: "error",
                description: error.response ? error.response.data.message : error.message,
                status: "error",
                position: "top-right",
                duration: 3000,
                isClosable: true
            })
        }
    }

    return (
        <Fragment>
            <IconButton display={{ base: "flex" }} onClick={onOpen} icon={<ViewIcon />} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={"35px"}
                        display={"flex"}
                        justifyContent={"center"}
                    >
                        {selectChat && selectChat.chatName?.toUpperCase()}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box
                            w={"100%"} display={"flex"} flexWrap={"wrap"} pb={3}
                        >
                            {selectChat.users.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleDelete={()=>handleDelete(u)}
                                />
                            ))}
                        </Box>
                        <FormControl display={"flex"}>
                            <Input
                                type='text'
                                placeholder='Chat Name'
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant={"solid"}
                                colorScheme='teal'
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                                isDisabled={!groupChatName}
                            >
                                Update
                            </Button>
                        </FormControl>
                        {
                            selectChat.groupAdmin?._id === user._id && (
                                <FormControl>
                                    <Input
                                        type='text'
                                        placeholder='Add User to Group'
                                        mb={1}
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />
                                </FormControl>
                            )
                        }
                        {
                            (searchResult || !loading) && searchResult.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleToAddFunction(user)}
                                />
                            ))
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button w={"100%"} colorScheme='red' mr={3} onClick={handleRemove}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Fragment>
    )
}

export default UpdateGroupChatModal
