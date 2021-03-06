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
  SimpleGrid,
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
  toast,
  useToast,
} from "@chakra-ui/react";
import firebase from "firebase";
import { useEffect, useState, useCallback, useContext } from "react";
import { AuthContext } from "../../src/context/Auth";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Spot } from "../../types/spot";
import { Review } from "../../types/review";
import { User } from "../../types/user";
import SpotCard from "../../src/components/SpotCard/SpotCard";
import ReviewCard from "../../src/components/ReviewCard/ReviewCard";
import ImageUpload from "../../src/components/ImageUpload/ImageUpload";
import { handleUpload } from "../../src/utils/imageUpload";
import { getImagePromise } from "../../src/utils/getImagePromise";
import { ImageCacheContext } from "../../src/context/ImageCache";

const fetcher = (url: string) => axios.get(url).then((res) => res.data.user);

const userPage: React.FC = () => {
  const { currentUser } = useContext(AuthContext);
  const { imageCache, setImageCache } = useContext(ImageCacheContext);
  const [avatarSrc, setAvatarSrc] = useState<any | null>();
  const [avatarFiles, setAvatarFiles] = useState<File[]>([]);
  const router = useRouter();
  const { id } = router.query;
  const { data: user, error } = useSWR<User>("/api/users/" + id, fetcher);
  const [loading, setLoading] = useState<boolean>(false);
  const [newUserName, setNewUserName] = useState<string>("");
  const toast = useToast();

  useEffect(() => {
    //まずキャッシュに画像のurlがあるかチェックする。
    if (typeof id == "string" && `user-${id}` in imageCache)
      setAvatarSrc(imageCache[`user-${id}`]);
    else {
      getAvatar(`users/resized/${id}_150x150`);
    }
  }, [id]);

  const getAvatar = useCallback(async (path: string) => {
    getImagePromise(path).then((res) => {
      setAvatarSrc(res);
      if (id != undefined) {
        setImageCache({ ...imageCache, [`user-${id}`]: res });
      }
    });
  }, []);

  // このメソッドビミョい
  const updateUser = async () => {
    setLoading(true);
    if (avatarFiles.length > 0) {
      handleUpload(`/users/${id}`, avatarFiles);
      toast({
        title:
          "プロフィール画像を更新しました。更新には時間がかかることがあります。",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
    if (newUserName == "") return;
    if (newUserName.length > 20) {
      toast({
        title: "ユーザーネームは20文字以内で入力して下さい",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    await axios
      .put("/api/users/" + id, {
        user: {
          name: newUserName,
        },
      })
      .then(() => {
        setLoading(false);
        toast({
          title: "ユーザーネームを更新しました",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        router.reload();
      });
  };

  if (error) return <div>failed to load</div>;

  // ロード中はスケルトンを表示
  if (!user)
    return (
      <Center>
        <Stack py={5} spacing={3} w={{ base: "95%", md: "650px" }}>
          <SkeletonCircle w="200px" h="200px"></SkeletonCircle>
          <SkeletonText w="200px" noOfLines={2}></SkeletonText>
          <SimpleGrid columns={[1, null, 2]} spacing={4} pt={10}>
          {[...Array(10)].map(() => {
              return (
                <Box borderWidth="1px" rounded={"md"}>
                  <Skeleton h={200} />
                  <Box p={5}>
                    <SkeletonText></SkeletonText>
                    <Flex pt={5}>
                      <SkeletonCircle mr={2}></SkeletonCircle>
                      <SkeletonText
                        height="30px"
                        width="100px"
                        noOfLines={2}
                      ></SkeletonText>
                      <Spacer />
                    </Flex>
                  </Box>
                </Box>
              );
            })}
          </SimpleGrid>
        </Stack>
      </Center>
    );

  return (
    <Center>
      <Stack py={5} spacing={3} w={{ base: "95%", md: "650px" }}>
        <Stack px={3}>
          <Avatar size={"2xl"} src={avatarSrc} />
          {currentUser != undefined && user.id == currentUser.id ? (
            <>
              <ImageUpload myFiles={avatarFiles} setMyFiles={setAvatarFiles}>
                <Text color="gray">change</Text>
              </ImageUpload>
              <Editable
                defaultValue={user.name}
                onChange={(val) => setNewUserName(val)}
              >
                <EditablePreview fontSize="3xl" fontWeight="bold" />
                <EditableInput fontSize="3xl" fontWeight="bold" />
              </Editable>
              {(avatarFiles.length > 0 ||
                (user.name !== newUserName && newUserName != "")) && (
                <Button onClick={() => updateUser()} isLoading={loading}>
                  更新
                </Button>
              )}
            </>
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
                <SimpleGrid columns={[1, null, 2]} spacing={4}>
                  {user.spots.reverse().map((spot: Spot, i) => {
                    if (
                      currentUser == undefined ||
                      user.id !== currentUser.id
                    ) {
                      if (spot.is_anonymous) return;
                    }
                    return <SpotCard key={spot.id} spot={spot} />;
                  })}
                </SimpleGrid>
              </Stack>
            </TabPanel>
            <TabPanel>
              <Stack>
                <SimpleGrid columns={[1, null, 2]} spacing={4}>
                  {user.reviews.map((review: Review, i) => {
                    return <ReviewCard review={review} key={i} />;
                  })}
                </SimpleGrid>
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Center>
  );
};

export default userPage;
