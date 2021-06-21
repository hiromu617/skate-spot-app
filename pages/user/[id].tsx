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
  VStack,
} from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/avatar";
import {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  Editable,
  EditableInput,
  EditablePreview,
} from "@chakra-ui/react";
import firebase from "firebase";
import { useEffect, useState, useCallback, useContext } from "react";
import { AuthContext } from "../../src/context/Auth";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Spot } from "../../types/spot";
import { Review } from "../../types/review";
import { User } from "../../types/user";
import SpotCard from "../../src/components/SpotCard";
import ReviewCard from "../../src/components/ReviewCard";

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

const fetcher = (url: string) => axios.get(url).then((res) => res.data.user);

const userPage: React.FC = () => {
  const { currentUser } = useContext(AuthContext);
  const [imageSrc, setImageSrc] = useState<any | null>();
  const router = useRouter();
  const { id } = router.query;
  const { data: user, error } = useSWR<User>("/api/users/" + id, fetcher);
  // useEffect(() => {
  //   // imageがnullの時imageを取得
  //   if (id != undefined) {
  //     getSpotImage(+id);
  //   }
  // }, [id]);

  // const getSpotImage = useCallback(async (id: number) => {
  //   getImage(id).then((res) => {
  //     setImageSrc(res);
  //   });
  // }, []);

  if (error) return <div>failed to load</div>;

  // ロード中はスケルトンを表示
  if (!user)
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
      <Stack py={5} spacing={3} w={{ base: "95%", md: "550px" }}>
        <Stack px={3}>
          <Avatar size={"2xl"} />
          {currentUser != undefined && user.id == currentUser.id ? (
            <Editable defaultValue={user.name}>
              <EditablePreview fontSize="3xl" fontWeight="bold" />
              <EditableInput fontSize="3xl" fontWeight="bold" />
            </Editable>
          ) : (
            <Heading>{user.name}</Heading>
          )}
        </Stack>
        <Divider />
        <Tabs isFitted colorScheme="purple">
          <TabList mb="1em">
            <Tab>Spots</Tab>
            <Tab>Reviews</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Stack>
                {user.spots.reverse().map((spot: Spot) => {
                  if (currentUser == undefined || user.id !== currentUser.id) {
                    if (spot.is_anonymous) return;
                  }
                  return <SpotCard key={spot.id} spot={spot} />;
                })}
              </Stack>
            </TabPanel>
            <TabPanel>
              <Stack>
                {user.reviews.map((review: Review) => {
                  return <ReviewCard review={review} />;
                })}
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Center>
  );
};

export default userPage;
