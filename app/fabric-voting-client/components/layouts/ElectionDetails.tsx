import {
  useColorModeValue,
  Flex,
  Heading,
  Text,
  Box,
  IconButton,
  HStack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Image,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  InputGroup,
  InputLeftAddon,
  VStack,
  MenuItem,
  Menu,
  MenuButton,
  MenuList,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useRef } from "react";
import {
  FiChevronDown,
  FiChevronsDown,
  FiClipboard,
  FiUserPlus,
} from "react-icons/fi";
import copyMessage from "../utils/copyMessage";

interface ElectionDetailsProps {
  electionName: string;
  electionID: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export default function ElectionDetails({
  electionName,
  electionID,
  startDate,
  endDate,
  createdAt,
  updatedAt,
}: ElectionDetailsProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const btnRef = useRef();

  // this is just a mock data
  const candidates = [
    {
      studentID: "candidate.999",
      name: "Jane Doe",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      faculty: "FTSM",
      party: "Gang Biru",
      votes: 389,
    },
    {
      studentID: "candidate.888",
      name: "Arman Duplantis",
      avatar:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
      faculty: "FSSK",
      party: "Gang Merah",
      votes: 1093,
    },
    {
      studentID: "candidate.777",
      name: "Some guy",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=761&q=80",
      faculty: "FPEND",
      party: "Gang Kuning",
      votes: 3,
    },
  ];

  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      w="60%"
      h="80vh"
      px={4}
      py={2}
      shadow="lg"
      rounded="lg"
    >
      <Flex direction="column" width="full">
        {/* horizontal stack */}
        <Flex w="full" justifyContent="space-between" alignItems={"center"}>
          <Text
            h={"fit-content"}
            px={3}
            py={1}
            bg={new Date() > endDate ? "red.400" : "green.400"}
            color="gray.100"
            fontSize="sm"
            fontWeight="700"
            rounded="md"
          >
            {new Date() > endDate ? "Ended" : "Ongoing"}
          </Text>
          <IconButton
            size="md"
            colorScheme="gray"
            variant="ghost"
            mx={3}
            aria-label="copy eletion url"
            icon={<FiClipboard />}
            onClick={() => {
              copyMessage(electionID);
            }}
          />
        </Flex>

        <Flex justifyContent="space-between" alignItems={"end"}>
          <Flex direction="column" justifyItems="start">
            <Heading mt={2}>{electionName}</Heading>
            <Text color="gray.500" fontSize="sm">
              {format(startDate, "PPppp")} ~ {format(endDate, "PPppp")}
            </Text>
            <Text color="gray.500" fontSize="sm">
              Last updated at {format(updatedAt, "PPpp")}
            </Text>
          </Flex>
          <VStack alignItems={"end"}>
            <Menu>
              <MenuButton px={"2"} as={Button} rightIcon={<FiChevronDown />}>
                Actions
              </MenuButton>
              <MenuList>
                <MenuItem>View Result</MenuItem>
                {new Date() < endDate && <MenuItem color={"red.500"}>End Election</MenuItem>}
              </MenuList>
            </Menu>
            <IconButton
              size="md"
              colorScheme="purple"
              variant="outline"
              mx={3}
              aria-label="copy eletion url"
              icon={<FiUserPlus />}
              onClick={onOpen}
            />
          </VStack>
        </Flex>

        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Faculty</Th>
                <Th>Party</Th>
                <Th isNumeric>Votes</Th>
              </Tr>
            </Thead>
            <Tbody overflow="scroll" maxHeight="50vh">
              {candidates.map((candidate) => (
                <Tr key={candidate.studentID}>
                  <Td>
                    <HStack>
                      <Image
                        w={10}
                        h={10}
                        rounded="full"
                        fit="cover"
                        border="2px"
                        borderColor="white"
                        display={{
                          base: "none",
                          sm: "block",
                        }}
                        // avatar
                        src={candidate.avatar}
                        alt="avatar"
                      />
                      <Flex direction="column" justifyItems="start">
                        {/* name */}
                        <Text fontWeight="600">{candidate.name}</Text>
                        <Text size="sm" color="gray.500">
                          @{candidate.name}
                        </Text>
                      </Flex>
                    </HStack>
                  </Td>
                  <Td>
                    <Text
                      px={3}
                      width="fit-content"
                      bg="orange.100"
                      border="2px"
                      borderColor="orange.600"
                      color="orange.600"
                      fontSize="xs"
                      fontWeight="600"
                      rounded="full"
                    >
                      {candidate.faculty}
                    </Text>
                  </Td>
                  <Td>{candidate.party}</Td>
                  <Td isNumeric>{candidate.votes}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        <Modal initialFocusRef={btnRef} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add candidate</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input ref={btnRef} placeholder="First name" />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Faculty</FormLabel>
                <Input placeholder="Faculty" />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Party</FormLabel>
                <Input placeholder="Party" />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Faculty</FormLabel>
                <Input placeholder="Faculty" />
              </FormControl>

              <InputGroup mt={4}>
                <FormLabel>Profile picture</FormLabel>
                {/* eslint-disable-next-line react/no-children-prop */}
                <InputLeftAddon children="https://" />
                <Input placeholder="remote image" />
              </InputGroup>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3}>
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </Box>
  );
}
