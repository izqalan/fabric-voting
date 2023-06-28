/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router";
import {
  Box,
  Container,
  Flex,
  Text,
  Image,
  useRadioGroup,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import Api from "@/components/utils/api";
import { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { formatDistance } from "date-fns";
import RadioCard from "@/components/elements/radioCard";

export default function Election() {
  const api = new Api();
  // Get electionID from URL
  const router = useRouter();
  const { electionID } = router.query;
  const [electionInfo, setElectionInfo] = useState({} as any);
  const [electionCandidates, setElectionCandidates] = useState([]);
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [candidateId, setCandidateId] = useState("");

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "candidate",
    onChange: (value) => setCandidateId(value),
  });

  const group = getRootProps();

  useEffect(() => {
    const fetchCandidates = async () => {
      const res = await api.get(`/candidate/${electionID}`);
      if (res.status === 200) {
        setElectionCandidates(res.data);
      }
    };
    const fetchElectionInfo = async () => {
      const res = await api.get(`/election/${electionID}`);
      if (res.status === 200) {
        setElectionInfo(res);
      }
    };
    fetchCandidates();
    fetchElectionInfo();
  }, [electionID]);

  // redirect to relection result page if election has ended
  useEffect(() => {
    if (!isEmpty(electionInfo)) {
      const endDate = new Date(electionInfo.data.endDate);
      const now = new Date();
      if (endDate < now) {
        router.push(`/election/result/${electionID}`);
      }
    }
  }, [electionInfo]);

  const toast = useToast();

  const castVote = async (email: string, password: string, candidateId: string, electionId: string) => {
    const apiV2 = new Api(process.env.NEXT_PUBLIC_API_URL + "/api/v2");
    const payload = {
      email: email,
      password: password,
      candidateID: candidateId,
      electionID: electionId,
    }

    // check if payload is empty
    if (isEmpty(payload.candidateID) || isEmpty(payload.electionID)) {
      toast({
        title: "Error",
        description: "Please fill in all fields and select a candidate",
        status: "error",
        isClosable: true,
      });
      return;
    }
    
    const res = await apiV2.post(`/ballot/vote`, payload);
    if (res.status === 200) {
      toast({
        title: `${res.message}`,
        status: "success",
        isClosable: true,
      });
    } else {
      toast({
        title: `error`,
        description: res.error,
        status: "error",
        isClosable: true,
      });
    }
  };

  const gotoRegister = () => {
    router.push(`/register/${electionID}`);
  };
    
  return (
    <Flex
      direction={"column"}
      justifyContent={"space-between"}
      justifyItems={"center"}
      alignItems={"center"}
      height={"100vh"}
      py={10}
    >
      <Container>
        {!isEmpty(electionInfo) && (
          <Flex direction={"column"}>
            <Text fontWeight={"bold"} fontSize={"3xl"}>
              {electionInfo.data.electionName}
            </Text>
            <Text>
              Election 
              {new Date() > new Date(electionInfo.data.endDate) ? " ended" : " ends"}{" "}
              {formatDistance(new Date(electionInfo.data.endDate), new Date(), {
                addSuffix: true,
              })}
            </Text>
          </Flex>
        )}

        {!isEmpty(electionCandidates) && new Date() < new Date(electionInfo.data.endDate) && (
          <Flex direction={"row"} overflow={'scroll'} overflowWrap={'normal'}>
            {electionCandidates.map((candidate: any) => {
              const radio = getRadioProps({ value: candidate.Key });

              return (
                <Box key={candidate.Key} mr={2}>
                  <RadioCard key={candidate.Key} {...radio}>
                    <Image
                      src={candidate.Record.avatar}
                      alt={candidate.name}
                      borderRadius={"lg"}
                      objectFit={"cover"}
                      // 1:1 ratio
                      h={["100px", "150px"]}
                      w={["100px", "150px"]}
                    />
                    <Text fontWeight={"bold"} fontSize={"xl"}>
                      {candidate.Record.name}
                    </Text>
                    <Text>Party: {candidate.Record.party}</Text>
                    <Text>Faculty: {candidate.Record.faculty}</Text>
                  </RadioCard>
                </Box>
              );
            })}
          </Flex>
        )}
      </Container>

      {!isEmpty(electionCandidates) && new Date() < new Date(electionInfo.data.endDate) && (
        <Container>
        <Flex direction={"column"}>
          <Input onChange={(e) => setEmail(e.target.value)} my={2} required variant="outline" placeholder="siswa email" type="email"/>
          <Input onChange={(e) => setPassword(e.target.value)} my={2} required variant="outline" placeholder="password" type="password"/>
          <Button onClick={() => castVote(email, password, candidateId, electionInfo.data.electionID)} my={2}>Cast vote</Button>
        </Flex>
      </Container>
      )}
    </Flex>
  );
}
