import React, { Fragment } from 'react'
import { Box } from "@chakra-ui/react"
import { useChatState } from "../../context/ChatProvider" 
import SingleChat from './SingleChat'

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectChat } = useChatState()
  return (
    <Fragment>
        <Box
          display={{base: selectChat ? "flex" : "none", md: "flex"}}
          alignItems={"center"}
          flexDir={"column"}
          p={3}
          bg={"white"}
          w={{base: "100%", md: "68%"}}
          borderRadius={"lg"}
          borderWidth={"1px"}
        >
          <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    </Fragment>
  )
}

export default ChatBox
