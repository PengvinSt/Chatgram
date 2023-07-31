import { Box, Text } from '@chakra-ui/react'
import React from 'react'

export default function ChatBoxDummy() {
  return (
    <Box d="flex" alignItems="center" justifyContent="center" h="100%">
            <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                No chat is curentlly chosen
            </Text>
    </Box>
  )
}
