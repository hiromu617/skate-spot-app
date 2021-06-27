import { Heading, Box, Text, Flex, Spacer, HStack } from "@chakra-ui/layout";
import { Tag, Button } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
import Link from "next/link";
import { Review } from "../../../types/review";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { ja } from "date-fns/locale";
import Rating from "react-rating";
import { StarIcon } from "@chakra-ui/icons";
import { useEffect, useState, useCallback, useContext } from "react";
import { getImagePromise } from "../../utils/getImagePromise";
import { ImageCacheContext } from "../../context/ImageCache";

type Props = {
  review: Review;
};

const ReviewCard: React.FC<Props> = ({ review }) => {
  const { imageCache, setImageCache } = useContext(ImageCacheContext);
  const [avatarSrc, setAvatarSrc] = useState<any | null>();

  useEffect(() => {
    if (`user-${review.user.id}` in imageCache)
      setAvatarSrc(imageCache[`user-${review.user.id}`]);
    else {
      getAvatar(`users/resized/${review.user.id}_150x150`);
    }
  }, [review.user.id]);

  const getAvatar = useCallback(async (path: string) => {
    getImagePromise(path).then((res) => {
      setAvatarSrc(res);
      if (review.user.id != undefined) {
        setImageCache({ ...imageCache, [`user-${review.user.id}`]: res });
      }
    });
  }, []);
  return (
    <Box borderWidth="1px" rounded={"md"} p={5}>
      {typeof review.spot !== "undefined" && (
        <Link href="/spot/[id]" as={`/spot/${review.spot.id}`} passHref>
          <Text size="sm" mb={2} color={"gray.500"}>
            {review.spot.name}のレビュー
          </Text>
        </Link>
      )}
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
            <Avatar size="sm" mr="2" src={avatarSrc} />
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
