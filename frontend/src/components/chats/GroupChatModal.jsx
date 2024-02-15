import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useToast } from '@chakra-ui/react'
import { useDisclosure } from "@chakra-ui/hooks"
import React, { Fragment, useState } from 'react'
import { useChatState } from '../../context/ChatProvider'
import axios from 'axios'
import { GET_CONFIG, POST_CONFIG, REQUEST_URL } from '../../url'
import UserListItem from '../useravatar/UserListItem'
import UserBadgeItem from '../useravatar/UserBadgeItem'

const GroupChatModal = ({ children }) => {
    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectUsers] = useState([])
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)

    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    const { chats, setChats } = useChatState()

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

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
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
        setSelectUsers([...selectedUsers, userToAdd])
    }

    const handleDelete = (delUser) => {
        setSelectUsers(selectedUsers.filter((sel) => sel._id !== delUser._id))
    }

    const handleSubmit = async () => {
        try{
            const { data } = await axios.post(`${REQUEST_URL}/chat/group`, {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id))
            }, POST_CONFIG)
            setChats([data.groupChat, ...chats])
            onClose()
            toast({
                title: "success",
                description: "new group created",
                status: "success",
                position: "top-right",
                duration: 3000,
                isClosable: true
            })
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
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={"35px"}
                        display={"flex"}
                        justifyContent={"center"}
                    >
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={"flex"}
                        flexDir={"column"}
                        alignItems={"center"}
                    >
                        <FormControl>
                            <Input
                                type='text'
                                placeholder='Chat Name'
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                type='text'
                                placeholder='Add Users eg: John, Piyush, Jane'
                                mb={1}
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box w="100%" display="flex" flexWrap="wrap">
                            {
                                selectedUsers && selectedUsers.map((user) => (
                                    <UserBadgeItem
                                        key={user._id}
                                        user={user}
                                        handleDelete={()=>handleDelete(user)}
                                    />
                                ))
                            }
                        </Box>
                        {
                            loading ? (
                                <Spinner />
                            ) : (
                                searchResult && searchResult.slice(0, 4).map(user => (
                                    <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                                ))
                            )
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button isDisabled={!groupChatName || selectedUsers.length < 3} colorScheme='blue' w={"100%"} onClick={handleSubmit}>
                            Create Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Fragment>
    )
}

export default GroupChatModal
