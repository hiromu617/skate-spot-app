import { Heading, Box, Text, Flex, Spacer,HStack } from "@chakra-ui/layout";
import { Tag, Button } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
import Link from "next/link";
import { Review } from "../../types/review";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { ja } from "date-fns/locale";
import Rating from "react-rating";
import { StarIcon } from "@chakra-ui/icons";

type Props = {
  review: Review;
};

const ReviewCard: React.FC<Props> = ({ review }) => {
  return (
    <Box borderWidth="1px" rounded={"md"} p={5}>
      <Rating
        initialRating={review.rating}
        readonly
        emptySymbol={<StarIcon boxSize={7} color="gray.100" />}
        fullSymbol={<StarIcon boxSize={7} color="yellow.300" />}
      />
      <Heading size="md" py={5}>
        {review.content}
      </Heading>
      <Flex align="center">
        <Link href="/user/[id]" as={`/user/${review.user.id}`}>
          <HStack>
          <Avatar size="sm" mr="2" src="" />
          <Text>{review.user.name}</Text>
          </HStack>
        </Link>
        <Spacer />
        <Text fontSize="xs">
          {formatDistanceToNow(new Date(review.created_at), {
            addSuffix: true,
            locale: ja,
          })}
        </Text>
      </Flex>
    </Box>
  );
};
export default ReviewCard;
