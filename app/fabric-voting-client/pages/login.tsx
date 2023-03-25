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
  useColorModeValue,
} from '@chakra-ui/react'
import { Logo } from '@/components/elements/logo'
import { PasswordField } from '@/components/elements/passwordField'


export default function Login() {

  return (
    <Box h="100vh"  bg={useColorModeValue("white", "gray.900")}>
      <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }} >
      <Stack spacing="8">
        <Stack spacing="6">
          <Logo />
          <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
            <Heading size={{ base: 'xs', md: 'sm' }} color={useColorModeValue("black", "white")}>Log in to your account</Heading>
            <HStack spacing="1" justify="center">
              <Text color="gray.500">Privacy is not a privilege, it's a right. Protect your vote, protect democracy.</Text>
            </HStack>
          </Stack>
        </Stack>
        <Box
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          // bg={{ base: 'transparent', sm: 'bg-surface' }}
          boxShadow={{ base: 'none', sm: 'md' }}
          borderRadius={{ base: 'none', sm: 'xl' }}
          bg={useColorModeValue("white", "gray.800")}
        >
          <Stack spacing="6">
            <Stack spacing="5">
              <FormControl>
                <FormLabel htmlFor="email" color={useColorModeValue("black", "white")}>Email</FormLabel>
                <Input id="email" type="email" bg={useColorModeValue("gray.200", "gray.700")} borderColor={useColorModeValue("gray.400", "gray.600")} _hover={{ borderColor: 'white' }} />
              </FormControl>
              <PasswordField />
            </Stack>
            <HStack justify="space-between">
              <Checkbox defaultChecked colorScheme="purple">
                <Text color={useColorModeValue("blackAlpha.800", "white")}>Remember me</Text>
              </Checkbox>
              <Button variant="link" colorScheme="blue" size="sm">
                <Text color="purple.500">Forgot password?</Text>
              </Button>
            </HStack>
          </Stack>
        </Box>
      </Stack>
    </Container>
    </Box>
  )
}
