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
  Square,
} from "@chakra-ui/layout";
import SpotMapShow from "../../src/components/SpotMapShow/SpotMapShow";
import { Avatar } from "@chakra-ui/avatar";
import format from "date-fns/format";
import { ja } from "date-fns/locale";
import {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Tag,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import firebase from "firebase";
import { useEffect, useState, useCallback, useContext } from "react";
import { AuthContext } from "../../src/context/Auth";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Spot } from "../../types/spot";
import { FaEllipsisV } from "react-icons/fa";
import ReviewWrap from "../../src/components/ReviewWrap/ReviewWrap";
import Rating from "react-rating";
import { StarIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { getImagePromise } from "../../src/utils/getImagePromise";
import { ImageCacheContext } from "../../src/context/ImageCache";

const fetcher = (url: string) => axios.get(url).then((res) => res.data.spot);

const spotShow: React.FC = () => {
  const { currentUser } = useContext(AuthContext);
  const router = useRouter();
  const { id } = router.query;
  const { data: spot, error } = useSWR<Spot>("/api/spots/" + id, fetcher);
  const toast = useToast();
  const { imageCache, setImageCache } = useContext(ImageCacheContext);
  const [avatarSrc, setAvatarSrc] = useState<any | null>();
  const [spotImageSrc, setSpotImageSrc] = useState<any | null>();

  useEffect(() => {
    // imageがnullの時imageを取得
    if (spot != undefined) {
      if (`user-${spot.user.id}` in imageCache)
        setAvatarSrc(imageCache[`user-${spot.user.id}`]);
      else {
        getAvatar(`users/resized/${spot.user.id}_150x150`);
      }
    }
    if (id != undefined) {
      if (`spot-${id}` in imageCache) setSpotImageSrc(imageCache[`spot-${id}`]);
      else {
        getSpotImage(`spots/resized/${id}_400x300`);
      }
    }
  }, [id, spot]);

  const getAvatar = useCallback(async (path: string) => {
    getImagePromise(path).then((res) => {
      setAvatarSrc(res);
      if (spot != undefined) {
        setImageCache({ ...imageCache, [`user-${spot.user.id}`]: res });
      }
    });
  }, []);

  const getSpotImage = useCallback(async (path: string) => {
    getImagePromise(path).then((res) => {
      setSpotImageSrc(res);
      setImageCache({ ...imageCache, [`spot-${id}`]: res });
    });
  }, []);

  const deleteSpot = async () => {
    if (!window.confirm("本当にスポットを削除してもよろしいですか？")) {
      return;
    }
    await axios.delete("/api/spots/" + id);
    router.push("/spot");
    toast({
      title: "スポットを削除しました",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  if (error) return <div>failed to load</div>;

  // ロード中はスケルトンを表示
  if (!spot)
    return (
      <Center>
        <Stack p={4} w={{ base: "90%", md: "550px" }}>
          <Skeleton height="60px"></Skeleton>
          <Flex flex="end" align="center">
            <Spacer />
            <SkeletonCircle></SkeletonCircle>
            <Skeleton height="30px" width="100px"></Skeleton>
          </Flex>
          <Flex flex="end" align="center">
            <Skeleton height="20px" width="120px"></Skeleton>
            <Spacer />
          </Flex>
          <SkeletonText pt={4}></SkeletonText>
          <Skeleton height="400px"></Skeleton>
        </Stack>
      </Center>
    );

  return (
    <div>
      <Center>
        <Stack p={4} w={{ base: "95%", md: "650px" }}>
          <Flex justify="space-between" align="center">
            <Heading>
              <Tag colorScheme="purple" size="lg" mr="2">
                {spot.prefectures}
              </Tag>
              {spot.name}
            </Heading>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<FaEllipsisV />}
                variant="link"
                size="lg"
              >
                Menu
              </MenuButton>
              <MenuList>
                {currentUser?.id === spot.user.id && (
                  <MenuItem
                    onClick={() =>
                      router.push({
                        pathname: `/spot/edit/${spot.id}`,
                        query: {
                          name: spot.name,
                          prefectures: spot.prefectures,
                          lat: spot.lat,
                          lng: spot.lng,
                          description: spot.description,
                          userid: spot.user.id,
                        },
                      })
                    }
                  >
                    編集
                  </MenuItem>
                )}
                {currentUser?.id === spot.user.id && (
                  <MenuItem onClick={() => deleteSpot()}>削除</MenuItem>
                )}
                <MenuItem>報告</MenuItem>
                <MenuItem>非公開リクエスト</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
          <Flex align="center">
            <Rating
              initialRating={spot.score}
              readonly
              emptySymbol={<StarIcon boxSize={7} color="gray.100" />}
              fullSymbol={<StarIcon boxSize={7} color="yellow.300" />}
            />
            <Text fontWeight="bold" fontSize="2xl">
              {" "}
              ({spot.reviews.length})
            </Text>
          </Flex>
          <Flex flex="end" align="center">
            <Spacer />
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
          </Flex>
          <Text>
            📝{format(new Date(spot.created_at), "P p", { locale: ja })}
          </Text>
          <Text pt={4} pb={5}>
            {spot.description}
          </Text>
          <Heading size="md">
            📷スポットの写真
          </Heading>
          {spotImageSrc ? (
            <Image h={400} src={spotImageSrc} mb={5} fit="cover"/>
          ) : (
            <Center h={400} bg={"gray.400"} color="white">No images</Center>
          )}
          <Heading size="md" pt={5}>
            🌏位置情報
          </Heading>
          <SpotMapShow lat={spot.lat} lng={spot.lng} />
        </Stack>
      </Center>
      <Center>
        <ReviewWrap
          spot={spot}
          currentUser={currentUser}
          reviews={spot.reviews}
        />
      </Center>
    </div>
  );
};

export default spotShow;
