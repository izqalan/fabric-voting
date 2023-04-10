import { useRouter } from "next/router";
import { Container, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Api from "@/components/utils/api";
import ElectionResult from "@/components/layouts/ElectionResult";
import { isEmpty } from "lodash";

export default function Result() {
  // Get electionID from URL
  const router = useRouter();
  const api = new Api();
  const [electionInfo, setElectionInfo] = useState<any>({});

  const { electionID } = router.query;

  useEffect(() => {
    const fetchElectionInfo = async () => {
      const res = await api.get(`/election/${electionID}`);
      if (res.status === 200) {
        setElectionInfo(res.data);
      }
    };
    fetchElectionInfo();
  }, [electionID]);

  return (
      <Flex
        justifyContent={"center"}
        justifyItems={"center"}
        w={"100vw"}
        h={"100vh"}
      >
        {!isEmpty(electionInfo) && (
          <ElectionResult
            electionName={electionInfo.electionName}
            electionID={electionID}
            startDate={new Date(electionInfo.startDate)}
            endDate={new Date(electionInfo.endDate)}
            createdAt={new Date(electionInfo.createdAt)}
            updatedAt={new Date(electionInfo.updatedAt)}
          />
        )}
      </Flex>
  );
}
