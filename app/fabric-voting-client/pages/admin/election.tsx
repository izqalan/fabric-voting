/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import ElectionCard from "@/components/elements/electionCard";
import ElectionDetails from "@/components/layouts/ElectionDetails";
import { addDays } from "date-fns";
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
  useToast,
} from "@chakra-ui/react";
import DatePicker from "@/components/elements/date-picker";
import Api from "@/components/utils/api";
import { useFormik } from "formik";
import { isEmpty } from "lodash";

export default function Election() {
  const toast = useToast();
  const api = new Api();
  const {
    isOpen: isNewElectionModalOpen,
    onOpen: onNewElectionModalOpen,
    onClose: onNewElectionModalClose,
  } = useDisclosure();
  const btnRef = React.useRef(null);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(), 1));
  const [activeElections, setActiveElections] = useState<any[]>([]);
  const [selectedElection, setSelectedElection] = useState<any>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await api.get("/election");
    if (res.status === 200) {
      setActiveElections(res.data.reverse());
    }
  };

  const formik = useFormik({
    initialValues: {
      electionName: "",
    },
    onSubmit: async (values) => {
      const res = await api.post("/election", {
        electionName: values.electionName,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      console.log(res);
      // check if response 201
      if (res.status === 201) {
        onNewElectionModalClose();
        toast({
          title: `${res.message}`,
          status: "success",
          isClosable: true,
        });
        fetchData();
      } else {
        // show error
        toast({
          title: `Error: ${res.message}`,
          status: "error",
          isClosable: true,
        });
      }
    },
  });

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
          {!isEmpty(activeElections) &&
            activeElections.map((election) => {
              if (new Date() < new Date(election.Record.endDate)) {
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
      </Flex>
      {!isEmpty(selectedElection) && (
        <ElectionDetails
          electionName={selectedElection.Record.electionName}
          electionID={selectedElection.Key}
          startDate={new Date(selectedElection.Record.startDate)}
          endDate={new Date(selectedElection.Record.endDate)}
          createdAt={new Date(selectedElection.Record.createdAt)}
          updatedAt={new Date(selectedElection.Record.updatedAt)}
        />
      )}
      <Modal
        initialFocusRef={btnRef}
        isOpen={isNewElectionModalOpen}
        onClose={onNewElectionModalClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create election</ModalHeader>
          <ModalCloseButton />

          <form onSubmit={formik.handleSubmit}>
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Election Name</FormLabel>
                <Input
                  ref={btnRef}
                  id="electionName"
                  name="electionName"
                  placeholder="Eg: PRU Ke-14"
                  required
                  value={formik.values.electionName}
                  onChange={formik.handleChange}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Start date</FormLabel>
                <DatePicker
                  id="startDate"
                  name="startDate"
                  selectedDate={startDate}
                  onChange={(date : any) => setStartDate(date)}
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
                  name="endDate"
                  selectedDate={endDate}
                  onChange={(date : any) => setEndDate(date)}
                  showTimeSelect
                  dateFormat="dd/MM/yyyy h:mm aa"
                  minDate={startDate}
                  required
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Save
              </Button>
              <Button onClick={onNewElectionModalClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
