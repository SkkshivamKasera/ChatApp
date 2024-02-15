import React, { Fragment, useEffect } from 'react'
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import Login from '../components/auth/Login'
import SignUp from '../components/auth/SignUp'
import { useNavigate } from 'react-router-dom'

const Home = () => {

  const navigate = useNavigate()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      navigate("/chats")
    }
  }, [navigate])

  return (
    <Fragment>
      <Container maxWidth={"xl"} centerContent>
        <Box display={"flex"} justifyContent={"center"} p={3} bg={"white"} w={"100%"} m={"20px 0 15px 0"} borderRadius={"lg"} borderWidth={"1px"}>
          <Text fontSize={"4xl"} color={"black"}>Talk-A-Live</Text>
        </Box>
        <Box bg={"white"} w={"100%"} p={4} borderRadius={"lg"} color={"black"} borderWidth={"1px"}>
          <Tabs variant='soft-rounded'>
            <TabList mb={"1em"}>
              <Tab w={"50%"}>Login</Tab>
              <Tab w={"50%"}>Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <SignUp />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </Fragment>
  )
}

export default Home
