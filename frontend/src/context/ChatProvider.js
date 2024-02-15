import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ChatContext = createContext()

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState()
    const [chats, setChats] = useState()
    const [selectChat, setSelectChat] = useState()
    const [notification, setNotification] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("user"))
        if(!userInfo){
            navigate("/")
        }
        setUser(userInfo)
    }, [navigate])
    return (
        <ChatContext.Provider value={{user, setUser, selectChat, setSelectChat, chats, setChats, notification, setNotification}}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChatState = () => {
    return useContext(ChatContext)
}

export default ChatProvider