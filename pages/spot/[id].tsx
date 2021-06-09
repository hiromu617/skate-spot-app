import axios from "../../constants/axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import {
  Heading,
  Stack,
  Center,
  Box,
  Text,
  Badge,
  Flex,
  Spacer,
} from "@chakra-ui/layout";
import SpotMap from "../../src/components/SpotMap";
import { Avatar } from "@chakra-ui/avatar";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const spotShow: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: spot, error } = useSWR("/api/spots/" + id, fetcher);
  console.log(spot)
  if (error) return <div>failed to load</div>;
  if (!spot) return <div>loading...</div>;

  return (
    <Center>
      <Stack p={4} w={{ base: "90%", md: "500px" }}>
        <Heading>
          <Badge colorScheme="green" size="xl" fontSize="1.75rem" mr="2">
            {spot.prefectures}
          </Badge>
          {spot.name}
        </Heading>
        <Flex flex="end" align="center">
          <Spacer />
          <Avatar size="sm" mr="2" src="https://bit.ly/tioluwani-kolawole" />
          <Text>{spot.user.name}</Text>
        </Flex>
        <Text>{spot.created_at}</Text>
        <Text pt={8}>{spot.description}</Text>
        <SpotMap lat={spot.lat} lng={spot.lng} />
      </Stack>
    </Center>
  );
};

export default spotShow;
