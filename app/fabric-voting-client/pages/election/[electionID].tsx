import { useRouter } from 'next/router'
import {
  Text,
} from "@chakra-ui/react";

export default function Election() {

  // Get electionID from URL
  const router = useRouter()
  const { electionID } = router.query

  return (
    <Text>Voting for {electionID}</Text>
  )
}