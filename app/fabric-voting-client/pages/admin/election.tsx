import React, { useState} from "react";
import ElectionCard from "@/components/elements/electionCard";
import ElectionDetails from "@/components/layouts/ElectionDetails";
import { addDays, subDays, format, isValid } from "date-fns";
import {
  useDisclosure,
  Flex,
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
} from "@chakra-ui/react";
import DatePicker from "@/components/elements/date-picker";

export default function Election() {
  const {
    isOpen: isNewElectionModalOpen,
    onOpen: onNewElectionModalOpen,
    onClose: onNewElectionModalClose,
  } = useDisclosure();
  const {
    isOpen: isDatePickerOpen,
    onOpen: onDatePickerOpen,
    onClose: onDatePickerClose,
  } = useDisclosure();
  const btnRef = React.useRef(null);

  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(addDays(new Date(), 1))

  return (
    <Flex direction="row" flexWrap="wrap">
      <Flex direction="column" w="40%" px={2}>
        <Button
          variant={"outline"}
          color={"purple.500"}
          borderColor={"purple.500"}
          _hover={{ bg: "purple.500", color: "white" }}
          mb={4}
          onClick={onNewElectionModalOpen}
        >
          New election
        </Button>
        <Flex direction="column" overflow="scroll" maxHeight={"79vh"}>
          <ElectionCard
            ref={btnRef}
            electionName="Pilihan Raya Univ. Malaya #99"
            electionID="election.88888888"
            startDate={subDays(new Date(), 2)}
            endDate={addDays(new Date(), 7)}
            createdAt={subDays(new Date(), 2)}
            updatedAt={subDays(new Date(), 1)}
            style={{ marginBottom: 16 }}
          />
          <ElectionCard
            ref={btnRef}
            electionName="Pilihan raya kampus UKM #42"
            electionID="election.1234567890"
            startDate={subDays(new Date(), 7)}
            endDate={subDays(new Date(), 2)}
            createdAt={subDays(new Date(), 7)}
            updatedAt={subDays(new Date(), 7)}
            style={{ marginBottom: 16 }}
          />
          <ElectionCard
            ref={btnRef}
            electionName="Pilihan raya kampus UKM #42"
            electionID="election.1234567890"
            startDate={subDays(new Date(), 7)}
            endDate={subDays(new Date(), 2)}
            createdAt={subDays(new Date(), 7)}
            updatedAt={subDays(new Date(), 7)}
            style={{ marginBottom: 16 }}
          />
          <ElectionCard
            ref={btnRef}
            electionName="Pilihan raya kampus UKM #42"
            electionID="election.1234567890"
            startDate={subDays(new Date(), 7)}
            endDate={subDays(new Date(), 2)}
            createdAt={subDays(new Date(), 7)}
            updatedAt={subDays(new Date(), 7)}
            style={{ marginBottom: 16 }}
          />
          <ElectionCard
            ref={btnRef}
            electionName="Pilihan raya kampus UKM #42"
            electionID="election.1234567890"
            startDate={subDays(new Date(), 7)}
            endDate={subDays(new Date(), 2)}
            createdAt={subDays(new Date(), 7)}
            updatedAt={subDays(new Date(), 7)}
            style={{ marginBottom: 16 }}
          />
        </Flex>
      </Flex>
      <ElectionDetails
        electionName="Pilihan Raya Univ. Malaya #99"
        electionID="election.88888888"
        startDate={subDays(new Date(), 2)}
        endDate={addDays(new Date(), 7)}
        createdAt={subDays(new Date(), 2)}
        updatedAt={subDays(new Date(), 1)}
      />

      <Modal
        initialFocusRef={btnRef}
        isOpen={isNewElectionModalOpen}
        onClose={onNewElectionModalClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create election</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Election Name</FormLabel>
              <Input ref={btnRef} placeholder="Eg: PRU Ke-14" required />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Start date</FormLabel>
              <DatePicker
                id="startDate"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                showTimeSelect
                dateFormat="dd/MM/yyyy h:mm aa"
                minDate={new Date()}
                required
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>End date</FormLabel>
              <DatePicker
                id="endDate"
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                showTimeSelect
                dateFormat="dd/MM/yyyy h:mm aa"
                minDate={startDate}
                required
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Save
            </Button>
            <Button onClick={onNewElectionModalClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
