import { CloseIcon } from '@chakra-ui/icons'
import { Badge} from '@chakra-ui/react'
import React from 'react'

export default function UserTagItem({ user, handleFunction, admin }) {
  return (
    <Badge padding="3px 6px" borderRadius="lg" margin={1} marginBottom={2} variant="solid" fontSize={12} color="var(--main-buttons-color-text)" background="var(--main-buttons-color)" cursor="pointer" onClick={handleFunction} >
      {user._id === admin 
      ?<span>{user.name} (Admin)</span>
      :user.name
      }
      <CloseIcon paddingLeft={1} />
    </Badge>
  )
}
