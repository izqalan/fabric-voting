import { useRouter } from 'next/router'
import {
  VStack,
  Container,
  Text,
  FormControl,
  FormLabel,
  Button,
  Input,
  FormHelperText,
  Flex,
} from "@chakra-ui/react";

export default function Register() {

  // Get electionID from URL
  const router = useRouter()
  const { electionID } = router.query

  return (
    // Registration Form
    <VStack>
      <Container>
        <Flex direction={'column'} justifyContent={'center'} justifyItems={'center'} h={'100vh'}>
          <Text fontSize={'3xl'} >Registration for {electionID}</Text>
          <FormControl isRequired>
            <FormLabel>Student ID</FormLabel>
            <Input type='studentId' />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Email address</FormLabel>
            <Input type='email' />
            <FormHelperText>We'll never share your email.</FormHelperText>
          </FormControl>
          {/* Submit button */}
          <Flex justifyContent={'end'}>
            <Button colorScheme='purple'>Create</Button>
          </Flex>
        </Flex>

      </Container>
    </VStack>
  )
}