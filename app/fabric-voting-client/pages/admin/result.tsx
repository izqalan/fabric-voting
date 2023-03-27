import React from "react";
import ElectionCard from "@/components/elements/electionCard";
import ElectionResult from "@/components/layouts/ElectionResult";
import { addDays, subDays } from "date-fns";
import { Flex } from "@chakra-ui/react";

export default function Result() {
  const btnRef = React.useRef(null);

  return (
    <Flex direction="row" flexWrap="wrap">
      <Flex direction="column" w="40%" px={2} overflow="scroll" maxHeight={"85vh"}>
        <ElectionCard
          ref={btnRef}
          electionName="Pilihan raya kampus UKM #40"
          electionID="election.1234567890"
          startDate={subDays(new Date(), 30)}
          endDate={subDays(new Date(), 18)}
          createdAt={subDays(new Date(), 30)}
          updatedAt={subDays(new Date(), 29)}
          style={{ marginBottom: 16 }}
        />
        <ElectionCard
          ref={btnRef}
          electionName="Pilihan Raya Univ. Malaya #98"
          electionID="election.88888888"
          startDate={subDays(new Date(), 365)}
          endDate={subDays(new Date(), 355)}
          createdAt={subDays(new Date(), 365)}
          updatedAt={subDays(new Date(), 365)}
          style={{ marginBottom: 16 }}
        />
        <ElectionCard
          ref={btnRef}
          electionName="Pilihan Raya Univ. Malaya #98"
          electionID="election.88888888"
          startDate={subDays(new Date(), 365)}
          endDate={subDays(new Date(), 355)}
          createdAt={subDays(new Date(), 365)}
          updatedAt={subDays(new Date(), 365)}
          style={{ marginBottom: 16 }}
        />
        <ElectionCard
          ref={btnRef}
          electionName="Pilihan Raya Univ. Malaya #98"
          electionID="election.88888888"
          startDate={subDays(new Date(), 365)}
          endDate={subDays(new Date(), 355)}
          createdAt={subDays(new Date(), 365)}
          updatedAt={subDays(new Date(), 365)}
          style={{ marginBottom: 16 }}
        />
      </Flex>
      <ElectionResult
        electionName="Pilihan raya kampus UKM #40"
        electionID="election.1234567890"
        startDate={subDays(new Date(), 30)}
        endDate={subDays(new Date(), 18)}
        createdAt={subDays(new Date(), 30)}
        updatedAt={subDays(new Date(), 29)}
      />
    </Flex>
  );
}
