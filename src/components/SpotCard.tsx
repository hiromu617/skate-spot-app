import { Heading, Box, Text, Flex, Spacer } from "@chakra-ui/layout";
import { Tag, Button } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
import Link from "next/link";
import { Spot } from "../../types/spot";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { ja } from "date-fns/locale";

type Props = {
  spot: Spot;
};

const SpotCard: React.FC<Props> = ({ spot }) => {
  return (
    <Link href="/spot/[id]" as={`/spot/${spot.id}`}>
      <Box borderWidth="1px" rounded={"md"} p={5}>
        <Heading size="md" mb={5}>
          <Tag colorScheme="purple" mr="2">
            {spot.prefectures}
          </Tag>
          {spot.name}
        </Heading>
        <Flex align="center">
          <Avatar size="sm" mr="2" src="" />
          <Text>{spot.user.name}</Text>
          <Spacer />
          <Text fontSize="xs">
            {formatDistanceToNow(new Date(spot.created_at), {
              addSuffix: true,
              locale: ja,
            })}
          </Text>
        </Flex>
      </Box>
    </Link>
  );
};
export default SpotCard;
