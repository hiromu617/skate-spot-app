import { Heading, Box, Text, Flex, Spacer } from "@chakra-ui/layout";
import { Tag, Button } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
import Link from "next/link";
import { Spot } from "../../types/spot";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { ja } from "date-fns/locale";
import Rating from "react-rating";
import { StarIcon } from "@chakra-ui/icons";
import { getImagePromise } from "../../src/utils/getImagePromise";
import { ImageCacheContext } from "../../src/context/ImageCache";
import { useEffect, useState, useCallback, useContext } from "react";

type Props = {
  spot: Spot;
};

const SpotCard: React.FC<Props> = ({ spot }) => {
  const { imageCache, setImageCache } = useContext(ImageCacheContext);
  const [avatarSrc, setAvatarSrc] = useState<any | null>();

  useEffect(() => {
    if(spot.user.id in imageCache) setAvatarSrc(imageCache[spot.user.id]) 
    else {
      getAvatar(`users/resized/${spot.user.id}_150x150`);
    }
  }, [spot.user.id]);

  const getAvatar = useCallback(async (path: string) => {
    getImagePromise(path).then((res) => {
      setAvatarSrc(res);
      if(spot.user.id != undefined){
        setImageCache({...imageCache, [String(spot.user.id)]: res})
      }
    });
  }, []);

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
                <Avatar size="sm" mr="2" src={avatarSrc} />
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
