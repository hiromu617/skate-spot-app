import { Heading, Box, Text, Flex, Spacer } from "@chakra-ui/layout";
import { Tag, Button } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
import Link from "next/link";
import { Spot } from "../../types/spot";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { ja } from "date-fns/locale";
import Rating from "react-rating";
import { StarIcon } from "@chakra-ui/icons";

type Props = {
  spot: Spot;
};

const SpotCard: React.FC<Props> = ({ spot }) => {
  return (
    <Link href="/spot/[id]" as={`/spot/${spot.id}`}>
      <Box borderWidth="1px" rounded={"md"} p={5}>
        <Heading size="md" mb={3}>
          <Tag colorScheme="purple" mr="2">
            {spot.prefectures}
          </Tag>
          {spot.name}
        </Heading>
        <Flex align="center" mb={3}>
          <Rating
            initialRating={spot.score}
            readonly
            emptySymbol={<StarIcon boxSize={5} color="gray.100" />}
            fullSymbol={<StarIcon boxSize={5} color="yellow.300" />}
          />
          <Text fontWeight="bold" fontSize="lg">
            {" "}
            ({spot.reviews.length})
          </Text>
        </Flex>
        <Flex align="center">
          {spot.is_anonymous ? (
            <Flex align="center">
              <Avatar size="sm" mr="2" src="" />
              <Text>匿名</Text>
            </Flex>
          ) : (
            <Link href="/user/[id]" as={`/user/${spot.user.id}`}>
              <Flex align="center">
                <Avatar size="sm" mr="2" src="" />
                <Text>{spot.user.name}</Text>
              </Flex>
            </Link>
          )}
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
