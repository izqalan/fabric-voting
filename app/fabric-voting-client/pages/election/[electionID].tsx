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
  Spacer,
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
  const [electionInfo, setElectionInfo] = useState({});
  const [electionCandidates, setElectionCandidates] = useState([]);

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "candidate",
    onChange: console.log,
  });

  const group = getRootProps();

  useEffect(() => {
    const fetchCandidates = async () => {
      const res = await api.get(`/candidate/${electionID}`);
      if (res.status === 200) {
        console.log(res.data);
        setElectionCandidates(res.data);
      }
    };
    const fetchElectionInfo = async () => {
      const res = await api.get(`/election/${electionID}`);
      if (res.status === 200) {
        console.log(res);
        setElectionInfo(res);
      }
    };
    fetchCandidates();
    fetchElectionInfo();
  }, [electionID]);

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
              Election ends in:{" "}
              {new Date() > electionInfo.data.endDate ? "Ended" : "Ends"}{" "}
              {formatDistance(new Date(electionInfo.data.endDate), new Date(), {
                addSuffix: true,
              })}
            </Text>
          </Flex>
        )}

        {!isEmpty(electionCandidates) && (
          <Flex direction={"row"} overflow={'scroll'} overflowWrap={'normal'}>
            {electionCandidates.map((candidate: any) => {
              const radio = getRadioProps({ value: candidate.studentID });

              return (
                <Box key={candidate.studentID} mr={2}>
                  <RadioCard key={candidate.studentID} {...radio}>
                    <Image
                      src={candidate.avatar}
                      alt={candidate.name}
                      borderRadius={"lg"}
                      objectFit={"cover"}
                      // 1:1 ratio
                      h={["100px", "150px"]}
                      w={["100px", "150px"]}
                    />
                    <Text fontWeight={"bold"} fontSize={"xl"}>
                      {candidate.name}
                    </Text>
                    <Text>Party: {candidate.party}</Text>
                    <Text>Faculty: {candidate.faculty}</Text>
                  </RadioCard>
                </Box>
              );
            })}
          </Flex>
        )}
      </Container>

      <Container>
        <Flex direction={"column"}>
          <Input my={2} variant="outline" placeholder="Your ID" />
          <Button my={2}>Cast vote</Button>
        </Flex>
      </Container>
    </Flex>
  );
}
