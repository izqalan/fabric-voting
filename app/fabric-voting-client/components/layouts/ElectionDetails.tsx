/* eslint-disable react-hooks/exhaustive-deps */
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
  useToast,
  Select,
  Divider,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useRef, useEffect, useState } from "react";
import {
  FiChevronDown,
  FiChevronsDown,
  FiClipboard,
  FiUserPlus,
} from "react-icons/fi";
import copyMessage from "../utils/copyMessage";
import Api from "../utils/api";
import { useFormik } from "formik";
import { isEmpty } from "lodash";

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
  const api = new Api();
  const btnRef = useRef<HTMLInputElement>(null);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const [candidates, setCandidates] = useState<any[]>([]);
  const [registeredCandidates, setRegisteredCandidates] = useState<any[]>([]);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get(`/candidate/${electionID}`);
      console.log(res.data);
      if (res.status === 200) {
        setCandidates(res.data);
      }
    };
    const fetchCandidates = async () => {
      const res = await api.get(`/candidate`);
      if (res.status === 200) {
        setRegisteredCandidates(res.data);
      }
    };
    fetchData();
    fetchCandidates();
  }, [electionID]);

  const formik = useFormik({
    initialValues: {
      name: "",
      studentId: "",
      faculty: "",
      party: "",
      avatar: "",
    },
    onSubmit: async (values) => {
      const res = await api.post("/candidate", {
        ...values,
        electionId: electionID,
      });
      console.log(res);
      // check if response 201
      if (res.status === 201) {
        onClose();
        toast({
          title: `${res.message}`,
          status: "success",
          isClosable: true,
        });
      } else {
        // show error
        toast({
          title: `Error: ${res.error}`,
          status: "error",
          isClosable: true,
        });
      }
    },
  });

  const handleEndElection = async (electionID: string) => {
    const payload = {
      target: "endDate",
      value: new Date().toISOString(),
    };
    const res = await api.put(`/election/${electionID}`, payload);
    if (res.status === 200) {
      toast({
        title: `${res.message}`,
        status: "success",
        isClosable: true,
      });
    } else {
      toast({
        title: `Error`,
        description: `${res.error}`,
        status: "error",
        isClosable: true,
      });
    }
  };

  const handleSelectCandidate = async (candidate: any) => {

    if (isEmpty(candidate.target.value)) {
      formik.setValues({
        name: "",
        studentId: "",
        faculty: "",
        party: "",
        avatar: "",
      });
      return;
    } 

    candidate = registeredCandidates[candidate.target.value].Record;

    // update formik values
    formik.setValues({
      name: candidate.name,
      studentId: candidate.studentID.replace("candidate.", ""),
      faculty: candidate.faculty,
      party: candidate.party,
      avatar: candidate.avatar,
    });

  };

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
            bg={
              new Date() > endDate
                ? "red.400"
                : new Date() < startDate
                ? "purple.500"
                : "green.400"
            }
            color="gray.100"
            fontSize="sm"
            fontWeight="700"
            rounded="md"
          >
            {new Date() > endDate
              ? "Ended"
              : new Date() < startDate
              ? "Upcoming"
              : "Ongoing"}
          </Text>
          <IconButton
            size="md"
            colorScheme="gray"
            variant="ghost"
            mx={3}
            aria-label="copy eletion url"
            icon={<FiClipboard />}
            onClick={() => {
              copyMessage(`${BASE_URL}/election/${electionID}`);
            }}
          />
        </Flex>

        <Flex justifyContent="space-between" alignItems={"end"}>
          <Flex direction="column" justifyItems="start">
            <Heading mt={2}>{electionName}</Heading>
            <Text color="gray.500" fontSize="sm">
              {format(startDate, "PPppp")} ~ {format(endDate, "PPppp")}
            </Text>
            {/* <Text color="gray.500" fontSize="sm">
              Last updated at {format(updatedAt, "PPpp")}
            </Text> */}
          </Flex>
          <VStack alignItems={"end"}>
            <Menu>
              <MenuButton px={"2"} as={Button} rightIcon={<FiChevronDown />}>
                Actions
              </MenuButton>
              <MenuList>
                {new Date() < endDate && (
                  <MenuItem
                    onClick={() => {
                      handleEndElection(electionID);
                    }}
                    color={"red.500"}
                  >
                    End Election
                  </MenuItem>
                )}
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
                {/* <Th isNumeric>Votes</Th> */}
              </Tr>
            </Thead>
            <Tbody overflow="scroll" maxHeight="50vh">
              {!isEmpty(candidates) &&
                candidates.map((candidate) => (
                  <Tr key={candidate.Key}>
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
                          src={candidate.Record.avatar}
                          alt="avatar"
                        />
                        <Flex direction="column" justifyItems="start">
                          {/* name */}
                          <Text fontWeight="600">{candidate.Record.name}</Text>
                          <Text size="sm" color="gray.500">
                            @{candidate.Record.name}
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
                        {candidate.Record.faculty}
                      </Text>
                    </Td>
                    <Td>{candidate.Record.party}</Td>
                    {/* <Td isNumeric>{candidate.votes}</Td> */}
                  </Tr>
                ))}
            </Tbody>
          </Table>
          {isEmpty(candidates) && (
            <Flex py={"4"} justifyContent={"center"} justifyItems={"center"}>
              <Text>There are no candidates, start adding now.</Text>
            </Flex>
          )}
        </TableContainer>

        <Modal finalFocusRef={btnRef} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add candidate</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={formik.handleSubmit}>
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel>Choose Existing candidates</FormLabel>
                  <Select placeholder="Select candidate" 
                    onChange={(e) => {
                      handleSelectCandidate(e);
                    }}
                  >
                    {isEmpty(registeredCandidates) ? (
                      <option value="none">No candidates</option>
                    ) : (
                      registeredCandidates.map((candidate, index) => (
                        <option key={index} value={index}>
                          {candidate.Record.name} ({candidate.Record.faculty})
                        </option>
                      ))
                    )}
                  </Select>
                </FormControl>
                <Flex py={4} alignItems={'center'} justifyItems={'center'}>
                  <Divider orientation="horizontal" />
                  <Text px={3} color="gray.500">
                    or
                  </Text>
                  <Divider orientation="horizontal" />
                </Flex>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    name="name"
                    required
                    ref={btnRef}
                    placeholder="Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Student ID</FormLabel>
                  <Input
                    name="studentId"
                    required
                    placeholder="Faculty"
                    value={formik.values.studentId}
                    onChange={formik.handleChange}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Party</FormLabel>
                  <Input
                    name="party"
                    required
                    placeholder="Party"
                    value={formik.values.party}
                    onChange={formik.handleChange}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Faculty</FormLabel>
                  <Input
                    name="faculty"
                    required
                    placeholder="Faculty"
                    value={formik.values.faculty}
                    onChange={formik.handleChange}
                  />
                </FormControl>

                <InputGroup mt={4}>
                  <FormLabel>Profile picture</FormLabel>
                  {/* eslint-disable-next-line react/no-children-prop */}
                  <InputLeftAddon children="https://" />
                  <Input
                    name="avatar"
                    required
                    placeholder="remote image"
                    value={formik.values.avatar}
                    onChange={formik.handleChange}
                  />
                  {formik.values.avatar && (
                    <Image
                      ml={2}
                      w={10}
                      h={10}
                      rounded="lg"
                      fit="cover"
                      border="1px"
                      borderColor="white"
                      display={{
                        base: "none",
                        sm: "block",
                      }}
                      // avatar
                      src={formik.values.avatar}
                      alt="avatar"
                    />
                  )}
                </InputGroup>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} type="submit">
                  Save
                </Button>
                <Button type="reset" onClick={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </Flex>
    </Box>
  );
}
