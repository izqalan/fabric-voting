import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react'
import { Logo } from '@/components/elements/logo'
import { PasswordField } from '@/components/elements/passwordField'


export default function Login() {

  return (
    <Box h="100vh"  bg="gray.900">
      <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }} >
      <Stack spacing="8">
        <Stack spacing="6">
          <Logo />
          <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
            <Heading size={{ base: 'xs', md: 'sm' }} color="white">Log in to your account</Heading>
            <HStack spacing="1" justify="center">
              <Text color="gray.400">Privacy is not a privilege, it's a right. Protect your vote, protect democracy.</Text>
            </HStack>
          </Stack>
        </Stack>
        <Box
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          // bg={{ base: 'transparent', sm: 'bg-surface' }}
          boxShadow={{ base: 'none', sm: 'md' }}
          borderRadius={{ base: 'none', sm: 'xl' }}
          bg="gray.800"
        >
          <Stack spacing="6">
            <Stack spacing="5">
              <FormControl>
                <FormLabel htmlFor="email" color="white">Email</FormLabel>
                <Input id="email" type="email" bg="gray.700" borderColor="gray.600" _hover={{ borderColor: 'white' }} />
              </FormControl>
              <PasswordField />
            </Stack>
            <HStack justify="space-between">
              <Checkbox defaultChecked colorScheme="blue">
                <Text color="white">Remember me</Text>
              </Checkbox>
              <Button variant="link" colorScheme="blue" size="sm">
                <Text color="blue.400">Forgot password?</Text>
              </Button>
            </HStack>
          </Stack>
        </Box>
      </Stack>
    </Container>
    </Box>
  )
}
