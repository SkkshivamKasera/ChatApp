import React, { Fragment, useState } from 'react'
import { useChatState } from '../context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SideDrawer from '../components/chats/SideDrawer'
import ChatBox from '../components/chats/ChatBox'
import MyChats from '../components/chats/MyChats'

const Chats = () => {
  const { user } = useChatState()
  const [fetchAgain, setFetchAgain] = useState(false)

  return (
    <Fragment>
      <div style={{ width: "100%" }}>
        {user && <SideDrawer />}
        <Box display={"flex"} justifyContent={"space-between"} width={"100%"} height={"95vh"} padding={"10px"} >
          {user && <MyChats fetchAgain={fetchAgain}/>}
          {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        </Box>
      </div>
    </Fragment>
  )
}

export default Chats
