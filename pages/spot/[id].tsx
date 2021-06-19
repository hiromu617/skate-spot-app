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
import SpotMapShow from "../../src/components/SpotMapShow";
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
} from "@chakra-ui/react";
import firebase from "firebase";
import { useEffect, useState, useCallback, useContext } from "react";
import { AuthContext } from "../../src/context/Auth";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Spot } from "../../types/spot";
import { FaEllipsisV } from "react-icons/fa";
import ReviewWrap from "../../src/components/ReviewWrap"

const getImage = (id: number) => {
  return new Promise((resolve) => {
    var storage = firebase.storage();
    var storageRef = storage.ref();
    var spaceRef = storageRef.child(`spots/resized/${id}_200x150`);
    spaceRef
      .getDownloadURL()
      .then(function (url: string) {
        console.log("ファイルURLを取得");
        console.log(url);
        resolve(url);
      })
      .catch(function (error) {
        // Handle any errors
        console.log(error);
      });
  });
};

const fetcher = (url: string) => axios.get(url).then((res) => res.data.spot);

const spotShow: React.FC = () => {
  const { currentUser } = useContext(AuthContext);
  const [imageSrc, setImageSrc] = useState<any | null>();
  const router = useRouter();
  const { id } = router.query;
  const { data: spot, error } = useSWR<Spot>("/api/spots/" + id, fetcher);
  console.log(spot);
  useEffect(() => {
    // imageがnullの時imageを取得
    if (id != undefined) {
      getSpotImage(+id);
    }
  }, [id]);

  const getSpotImage = useCallback(async (id: number) => {
    getImage(id).then((res) => {
      setImageSrc(res);
    });
  }, []);

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
      <Center px={3} pt={3}>
        {imageSrc && <Image w={700} src={imageSrc} mb={5} />}
      </Center>
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
                  <MenuItem onClick={() => alert("まだだよーん")}>
                    削除
                  </MenuItem>
                )}
                <MenuItem>報告</MenuItem>
                <MenuItem>非公開リクエスト</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
          <Flex flex="end" align="center">
            <Spacer />
            <Avatar size="sm" mr="2" src="" />
            <Text>{spot.user.name}</Text>
          </Flex>
          <Text>
            📝{format(new Date(spot.created_at), "P p", { locale: ja })}
          </Text>
          <Text pt={4} pb={10}>
            {spot.description}
          </Text>
          <Heading size="md">🌏位置情報</Heading>
          <SpotMapShow lat={spot.lat} lng={spot.lng} />
        </Stack>
      </Center>
      <Center>
        <ReviewWrap spot={spot} currentUser={currentUser} reviews={spot.reviews}/>
      </Center>
    </div>
  );
};

export default spotShow;
