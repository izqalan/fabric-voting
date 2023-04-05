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
  onClick?: () => void;
  ref?: any;
}

export default function ElectionCard({
  electionName,
  electionID,
  startDate,
  endDate,
  createdAt,
  updatedAt,
  onClick,
  ref,
  style
}: ElectionCardProps) {

  let candidates = [{
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
  }, {
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
  }, {
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=761&q=80"
  }
  ]

  return (
    <Box
      ref={ref}
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
      onClick={onClick}
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
          {formatDistance(endDate, new Date(), { addSuffix: true })}
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
              copyMessage(`http://localhost:3000/election/${electionID}`)
            }}
          />
          <Text
            px={3}
            py={1}
            bg={new Date > endDate ? "red.400" : new Date > startDate ? "green.400" : "purple.500"}
            color="gray.100"
            fontSize="sm"
            fontWeight="700"
            rounded="md"
          >
            {new Date > endDate ? "Ended" : new Date > startDate ? "Ongoing" : "Upcoming"}
          </Text>
        </Flex>
      </Flex>

      <Box mt={2}>
        <Text
          fontSize="xl"
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
      <Flex justifyContent="right" alignItems="center" mt={4} position="relative">
        {/**
         * TODO: update api and chaincode to include candidate avatar
         * */}
        {candidates.map((candidate, index) => (
          <Image
            key={index}
            w={10}
            h={10}
            rounded="full"
            fit="cover"
            border="2px"
            borderColor="white"
            marginRight={index * 6}
            position={{
              base: "absolute",
            }}
            display={{
              base: "none",
              sm: "block",
            }}
            src={candidate.avatar}
            alt="avatar"
            zIndex={candidates.length - index}
          />))
        }

        {/* hacky way to prevent the avatars from overlapping the card */}
        <div id="spacer" style={{
          width: "10px",
          height: "30px",
          marginRight: "0px"
        }} ></div>

      </Flex>
    </Box>
  )
}