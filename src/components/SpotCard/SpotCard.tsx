import { Heading, Box, Text, Flex, Spacer, Center } from "@chakra-ui/layout";
import { Tag, Button, Image } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
import Link from "next/link";
import { Spot } from "../../../types/spot";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { ja } from "date-fns/locale";
import Rating from "react-rating";
import { StarIcon } from "@chakra-ui/icons";
import { getImagePromise } from "../../utils/getImagePromise";
import { ImageCacheContext } from "../../context/ImageCache";
import { useEffect, useState, useCallback, useContext } from "react";

type Props = {
  spot: Spot;
};

const SpotCard: React.FC<Props> = ({ spot }) => {
  const { imageCache, setImageCache } = useContext(ImageCacheContext);
  const [avatarSrc, setAvatarSrc] = useState<string | null>();
  const [spotImageSrc, setSpotImageSrc] = useState<string | null>();

  useEffect(() => {
    if (`user-${spot.user.id}` in imageCache)
      setAvatarSrc(imageCache[`user-${spot.user.id}`]);
    else {
      getAvatar(`users/resized/${spot.user.id}_150x150`);
    }

    if (`spot-${spot.id}` in imageCache)
      setSpotImageSrc(imageCache[`spot-${spot.id}`]);
    else {
      getSpotImage(`spots/resized/${spot.id}_400x300`);
    }
  }, [spot.user.id, spot.id]);

  const getAvatar = useCallback(async (path: string) => {
    getImagePromise(path).then((res) => {
      if (typeof res == "string") {
        setAvatarSrc(res);
      }
      setImageCache({ ...imageCache, [`user-${spot.user.id}`]: res });
    });
  }, []);

  const getSpotImage = useCallback(async (path: string) => {
    getImagePromise(path).then((res) => {
      if (typeof res == "string") {
        setSpotImageSrc(res);
      }
      setImageCache({ ...imageCache, [`spot-${spot.id}`]: res });
    });
  }, []);

  return (
    <Link href="/spot/[id]" as={`/spot/${spot.id}`}>
      <Box borderWidth="1px" rounded={"md"}>
        {spotImageSrc ? (
          <Image
            src={spotImageSrc}
            h={200}
            w={"100%"}
            roundedTop={"md"}
            fit="cover"
          />
        ) : (
          <Center h={200} bg={"gray.400"} roundedTop={"md"} color="white">
            No images
          </Center>
        )}
        <Box p={5}>
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
                  {avatarSrc ? (
                    <Avatar size="sm" mr="2" src={avatarSrc} />
                  ) : (
                    <Avatar size="sm" mr="2"/>
                  )}
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
      </Box>
    </Link>
  );
};
export default SpotCard;
