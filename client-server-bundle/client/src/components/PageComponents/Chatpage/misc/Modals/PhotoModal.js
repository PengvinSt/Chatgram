import { Image, Modal,  ModalCloseButton,  ModalContent, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React from 'react'

export default function PhotoModal({children, image}) {
    const { isOpen, onOpen, onClose} = useDisclosure()
  return (
    <>
        <div onClick={onOpen}>{children}</div>

        <Modal isOpen={isOpen} onClose={onClose} isCentered>        
        <ModalOverlay />
        <ModalCloseButton />
            <ModalContent>
            <Image src={image} width="auto" height="auto"/>
            </ModalContent>
        </Modal>
    </>
    
  )
}
