import React from "react"
import ElectionCard from "@/components/elements/electionCard"
import ElectionDetails from "@/components/layouts/ElectionDetails"
import { addDays, subDays } from "date-fns"
import {
  useDisclosure,
  Flex,
  Button,
} from "@chakra-ui/react"


export default function Election() {

  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef(null)

  return (
    <Flex
      direction="row"
      flexWrap="wrap"
    >
      <Flex direction="column" w="40%" p={4}>
        <ElectionCard
          ref={btnRef}
          electionName="Pilihan Raya UM #99"
          electionID="election.1234567890"
          startDate={subDays(new Date(), 2)}
          endDate={addDays(new Date(), 7)}
          createdAt={subDays(new Date(), 2)}
          updatedAt={subDays(new Date(), 1)}
          style={{ marginBottom: 16 }}
          onClick={onOpen}
        />
        <ElectionCard
          ref={btnRef}
          electionName="Pilihan raya kampus UKM #42"
          electionID="election.1234567890"
          startDate={subDays(new Date(), 7)}
          endDate={subDays(new Date(), 2)}
          createdAt={subDays(new Date(), 7)}
          updatedAt={subDays(new Date(), 7)}
          style={{ marginBottom: 16 }}
        />
      </Flex>
      <ElectionDetails 
        electionName="Pilihan Raya UM #99"
        electionID="election.1234567890"
        startDate={subDays(new Date(), 2)}
        endDate={addDays(new Date(), 7)}
        createdAt={subDays(new Date(), 2)}
        updatedAt={subDays(new Date(), 1)}
      />
    </Flex>
  )
}