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
import format from "date-fns/format";
import { ja } from "date-fns/locale";
import { Skeleton, SkeletonCircle, SkeletonText, Tag, Image } from "@chakra-ui/react";
import firebase from 'firebase'
import { useEffect, useState, useCallback } from "react";

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
  const [imageSrc, setImageSrc] = useState<any | null>()
  const router = useRouter();
  const { id } = router.query;
  const { data: spot, error } = useSWR("/api/spots/" + id, fetcher);
  // console.log(spot);
  useEffect(() => {
    // imageがnullの時imageを取得
    if (id !=undefined) {
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
    <Center>
      <Stack p={4} w={{ base: "90%", md: "550px" }}>
        {imageSrc && <Image src={imageSrc}/>}
        <Flex>
          <Tag colorScheme="purple" size="lg" mr="2">
            {spot.prefectures}
          </Tag>
        <Heading>{spot.name}</Heading>
        </Flex>
        <Flex flex="end" align="center">
          <Spacer />
          <Avatar size="sm" mr="2" src="" />
          <Text>{spot.user.name}</Text>
        </Flex>
        <Text>{format(new Date(spot.created_at), "P p", { locale: ja })}</Text>
        <Text pt={4}>{spot.description}</Text>
        <SpotMap lat={spot.lat} lng={spot.lng} />
      </Stack>
    </Center>
  );
};

export default spotShow;
