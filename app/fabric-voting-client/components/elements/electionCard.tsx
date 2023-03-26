import { Flex, Box, Text, Image, chakra } from "@chakra-ui/react";
import { formatDistance, format } from "date-fns";
import { IconButton } from "@chakra-ui/react";
import { FiClipboard } from "react-icons/fi";
import copyMessage from "../utils/copyMessage";

interface ElectionCardProps {
  electionName: string;
  electionID: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  style?: React.CSSProperties;
}

export default function ElectionCard({
  electionName,
  electionID,
  startDate,
  endDate,
  createdAt,
  updatedAt,
  style
}: ElectionCardProps) {


  return (
    <Box
      style={style}
      px={8}
      py={4}
      rounded="lg"
      shadow="lg"
      bg="white"
      _dark={{
        bg: "gray.900",
      }}
      maxW="lg"
      minW="md"
      _hover={{
        border: "1px",
        borderColor: "purple.600",
        _dark: {
          border: "1px",
          borderColor: "purple.600",
        },
      }}
      cursor="pointer"
      boxShadow='linear(to-l, #7928CA, #FF0080)'
    >
      <Flex justifyContent="space-between" alignItems="center">
        <chakra.span
          fontSize="sm"
          color="gray.600"
          _dark={{
            color: "gray.400",
          }}
        >
          {/* if date has passed 'ended' */}
          {new Date > endDate ? "Ended " : "Ends "}
          {formatDistance(endDate, startDate, { addSuffix: true })}
        </chakra.span>
        <Flex alignItems="center">
          <IconButton
            size="lg"
            colorScheme="gray"
            variant="ghost"
            mx={3}
            aria-label="copy eletion url"
            icon={<FiClipboard />}
            onClick={() => {
              copyMessage(electionID)
            }}
          />
          <Text
            px={3}
            py={1}
            bg={new Date > endDate ? "red.400" : "green.400"}
            color="gray.100"
            fontSize="sm"
            fontWeight="700"
            rounded="md"
          >
            {new Date > endDate ? "Ended" : "Ongoing"}
          </Text>
        </Flex>
      </Flex>

      <Box mt={2}>
        <Text
          fontSize="2xl"
          color="gray.700"
          _dark={{
            color: "white",
          }}
          fontWeight="700"
          _hover={{
            color: "gray.600",
            _dark: {
              color: "gray.200",
            },
            textDecor: "underline",
          }}
        >
          {electionName}
        </Text>
        <chakra.p
          mt={2}
          color="gray.600"
          _dark={{
            color: "gray.300",
          }}
        >
          Election starts from {format(startDate, 'd MMMM yyyy')} and ends at {format(endDate, 'd MMMM yyyy')}
        </chakra.p>
      </Box>
    </Box>
  )
}