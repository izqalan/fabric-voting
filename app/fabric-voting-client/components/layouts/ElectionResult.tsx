import {
  useColorModeValue,
  Flex,
  Heading,
  Text,
  Box,
  IconButton,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Image,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useRef, useEffect, useState } from "react";
import { FiClipboard } from "react-icons/fi";
import copyMessage from "../utils/copyMessage";
import Api from "../utils/api";

interface ElectionResultProps {
  electionName: string;
  electionID: string | string[] | undefined;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export default function ElectionDResult({
  electionName,
  electionID,
  startDate,
  endDate,
  createdAt,
  updatedAt,
}: ElectionResultProps) {
  const BASE_URL = "http://localhost:3000"
  const api = new Api();
  const [candidates, setCandidates] = useState<any>([]);

  const btnRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get(`/candidate/${electionID}`);
      console.log(res);
      if (res.status === 200) {
        setCandidates(res.data);
      }
    };
    fetchData();
  }, [electionID]);

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
        <Flex w="full" justifyContent="space-between"  alignItems={"center"}>
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
              copyMessage(`${BASE_URL}/election/result/${electionID}`);
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
              {candidates.map((candidate: any) => (
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
                  {candidate.Record.elections.map((election: any) => {
                    if (election.electionID === electionID) {
                      return (
                        <Td key={'votes'} isNumeric>{election.votes}</Td>
                      );
                  }})}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </Box>
  );
}
