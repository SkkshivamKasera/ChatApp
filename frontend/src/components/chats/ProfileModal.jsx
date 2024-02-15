import { useDisclosure } from '@chakra-ui/hooks'
import { ViewIcon } from '@chakra-ui/icons'
import { IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import React, { Fragment } from 'react'

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <Fragment>
            {
                children ? (
                    <span onClick={onOpen}>{children}</span>
                ) : (
                    <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
                )
            }
            <Modal isOpen={isOpen} onClose={onClose} size={"lg"} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={"40px"}
                        display={"flex"}
                        justifyContent={"center"}
                        textTransform={"uppercase"}
                    >
                        {user && user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        flexDir={"column"}
                    >
                        <Image
                            borderRadius={"full"}
                            boxSize={"150px"}
                            src={user && user.avatar}
                            alt={user && user.name}
                        />
                        <Text
                            fontSize={{base: "28px", md: "30px"}}
                            mt={10}
                        >
                            {user && user.email}
                        </Text>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Fragment>
    )
}

export default ProfileModal
