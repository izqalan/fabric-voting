/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router";
import {
  VStack,
  Container,
  Text,
  FormControl,
  FormLabel,
  Button,
  Input,
  FormHelperText,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import Api from "@/components/utils/api";

export default function Register() {
  const api = new Api();
  const toast = useToast();
  const [electionInfo, setElectionInfo] = useState<any>({});
  // Get electionID from URL

  const router = useRouter();
  const { electionID } = router.query;

  const registerVoter = async (values: any) => {
    const res = await api.post("/voter", values);
    console.log(res);
    if (res.status === 201) {
      toast({
        title: "Successfully registered",
        description: "Voter registered successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Voter registration failed",
        description: res.error,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      studentID: "",
      email: "",
    },
    onSubmit: (values) => {
      registerVoter({
        ...values,
        electionID: electionID,
      });
    },
  });

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
    // Registration Form
    <VStack>
      <Container>
        <Flex
          direction={"column"}
          justifyContent={"center"}
          justifyItems={"center"}
          h={"100vh"}
        >
          <Text fontSize={"3xl"}>
            Registration for {electionInfo.electionName}
          </Text>
          <form onSubmit={formik.handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Student ID</FormLabel>
              <Input
                value={formik.values.studentID}
                onChange={formik.handleChange}
                name="studentID"
                type="studentId"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                type="email"
              />
              <FormHelperText>We&apos;ll never share your email.</FormHelperText>
            </FormControl>
            {/* Submit button */}
            <Flex justifyContent={"end"}>
              <Button type="submit" colorScheme="purple">
                Create
              </Button>
            </Flex>
          </form>
        </Flex>
      </Container>
    </VStack>
  );
}
