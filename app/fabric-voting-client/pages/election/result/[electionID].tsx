import { useRouter } from 'next/router'
import {
  Text,
} from "@chakra-ui/react";

export default function Result() {

  // Get electionID from URL
  const router = useRouter()
  const { electionID } = router.query

  return (
    <Text>Result for {electionID}</Text>
  )
}