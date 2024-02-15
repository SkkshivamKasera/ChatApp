import React, { Fragment, useState } from 'react'
import {
    Avatar,
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Input,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Text,
    Tooltip,
    useToast
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/hooks'
import { FaMagnifyingGlass } from "react-icons/fa6"
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { useChatState } from '../../context/ChatProvider'
import ProfileModal from './ProfileModal'
import axios from "axios";
import { GET_CONFIG, POST_CONFIG, REQUEST_URL } from "../../url";
import { useNavigate } from "react-router-dom";
import ChatLoading from './ChatLoading'
import UserListItem from '../useravatar/UserListItem'
import { getSender } from '../../config/ChatLogics'
import NotificationBadge, { Effect } from 'react-notification-badge';

const SideDrawer = () => {
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState(false)

    const toast = useToast()
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const { user, setSelectChat, chats, setChats, notification, setNotification } = useChatState()

    const logoutHandler = async () => {
        try {
            const { data } = await axios.get(`${REQUEST_URL}/logout`, GET_CONFIG)
            toast({
                title: "success",
                description: data.message,
                status: "success",
                position: "top-right",
                duration: 3000,
                isClosable: true
            })
            await localStorage.removeItem("user")
            navigate("/")
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
    }

    const handleSearch = async () => {
        setLoading(true)
        try {
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
        setSearch("")
        setLoading(false)
    }

    const accessChat = async (userId) => {
        setLoadingChat(true)
        try{
            const { data } = await axios.post(`${REQUEST_URL}/chat`, {
                userId
            }, POST_CONFIG)
            if(!chats.find(c => c._id === data.chat._id)){
                setChats([data.chat, ...chats])
            }
            setSelectChat(data.chat)
            onClose()
        }catch (error) {
            toast({
                title: "error",
                description: error.response ? error.response.data.message : error.message,
                status: "error",
                position: "top-right",
                duration: 3000,
                isClosable: true
            })
        }
        setLoadingChat(false)
    }

    return (
        <Fragment>
            <Box
                display="flex"
                justifyContent={"space-between"}
                alignItems={"center"}
                bg={"white"}
                w={"100%"}
                p={"5px 10px 5px 10px"}
                borderWidth={"5px"}
            >
                <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
                    <Button variant="ghost" onClick={onOpen}>
                        <FaMagnifyingGlass />
                        <Text d={{ base: "none", md: "flex" }} px={4}>
                            Search User
                        </Text>
                    </Button>
                </Tooltip>
                <Text fontSize={"2xl"}>Talk-A-Live</Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <NotificationBadge
                                count={notification?.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon fontSize={"2xl"} m={1} />
                        </MenuButton>
                        <MenuList pl={2}>
                            { !notification?.length && "No New Messages" }
                            {
                                notification && notification.map((notif) => (
                                    <MenuItem
                                        key={notif._id}
                                        onClick={() => {
                                            setSelectChat(notif?.chat)
                                            setNotification(notification.filter((n) => n !== notif))
                                        }}
                                    >
                                        {notif?.chat?.isGroupChat?`New Message in ${notif?.chat?.chatName}`:`New Message from ${getSender(user, notif?.chat?.users)}`}
                                    </MenuItem>
                                ))
                            }
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar
                                size={"sm"}
                                cursor={"pointer"}
                                name={user && user.name}
                                src={user && user.avatar}
                            />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user ? user : null}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box
                            display={"flex"}
                            pb={2}
                        >
                            <Input
                                type='text'
                                placeholder='Search by name and email'
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button colorScheme='blue' isDisabled={!search} isLoading={loading} onClick={handleSearch}><FaMagnifyingGlass /></Button>
                        </Box>
                        {
                            loading ? (
                                <ChatLoading />
                            ) : (
                                ( searchResult || !loadingChat ) && searchResult.map((user) => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => accessChat(user._id)}
                                    />
                                ))
                            )
                        }
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Fragment>
    )
}

export default SideDrawer