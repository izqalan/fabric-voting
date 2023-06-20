/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import ElectionCard from "@/components/elements/electionCard";
import ElectionResult from "@/components/layouts/ElectionResult";
import { subDays } from "date-fns";
import { Flex } from "@chakra-ui/react";
import Api from "@/components/utils/api";
import { useRouter } from "next/router";
import { isEmpty } from "lodash";

export default function Result() {
  const btnRef = React.useRef(null);
  const router = useRouter();
  const { electionID } = router.query;
  const [activeElections, setActiveElections] = useState<any[]>([]);
  const [electionInfo, setElectionInfo] = useState<any>({});
  const [electionCandidates, setElectionCandidates] = useState<any>([]);
  const [selectedElection, setSelectedElection] = useState<any>({});

  const api = new Api();

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/election");
      if (res.status === 200) {
        setActiveElections(res.data);
      }
    };
    fetchData();
  }, []);

  return (
    <Flex direction="row" flexWrap="wrap">
      <Flex
        direction="column"
        w="40%"
        px={2}
        overflow="scroll"
        maxHeight={"85vh"}
      >
        {!isEmpty(activeElections) &&
          activeElections.map((election) => {
            if (new Date() > new Date(election.Record.endDate)) {
              return (
                <ElectionCard
                  ref={btnRef}
                  key={election.Key}
                  electionName={election.Record.electionName}
                  electionID={election.Record.electionID}
                  startDate={new Date(election.Record.startDate)}
                  endDate={new Date(election.Record.endDate)}
                  createdAt={new Date(election.Record.createdAt)}
                  updatedAt={new Date(election.Record.updatedAt)}
                  style={{ marginBottom: 16 }}
                  onClick={() => setSelectedElection(election)}
                />
              );
            }
          })}
      </Flex>
      {!isEmpty(selectedElection) && (
        <ElectionResult
          electionName={selectedElection.Record.electionName}
          electionID={selectedElection.Key}
          startDate={new Date(selectedElection.Record.startDate)}
          endDate={new Date(selectedElection.Record.endDate)}
          createdAt={new Date(selectedElection.Record.createdAt)}
          updatedAt={new Date(selectedElection.Record.updatedAt)}
        />
      )}
    </Flex>
  );
}
