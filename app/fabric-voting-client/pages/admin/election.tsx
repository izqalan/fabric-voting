import React, { useState, useEffect } from "react";
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
  useToast,
} from "@chakra-ui/react";
import DatePicker from "@/components/elements/date-picker";
import Api from "@/components/utils/api";
import { useFormik } from "formik";
import { isEmpty } from "lodash";

export default function Election() {
  const toast = useToast();
  const api = new Api("http://localhost:8081/api/v1");
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

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(), 1));
  const [activeElections, setActiveElections] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/election");
      console.log(res)
      if (res.status === 200){
        setActiveElections(res.data);
      }
    };
    fetchData();
  }, []);

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
            activeElections.map((election) => (
              <ElectionCard
                ref={btnRef}
                key={election.key}
                electionName={election.Record.electionName}
                electionID={election.Record.electionID}
                startDate={new Date(election.Record.startDate)}
                endDate={new Date(election.Record.endDate)}
                createdAt={new Date(election.Record.createdAt)}
                updatedAt={new Date(election.Record.updatedAt)}
                style={{ marginBottom: 16 }}
              />
            ))}

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
                  name="endDate"
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
