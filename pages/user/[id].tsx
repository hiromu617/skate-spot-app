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
import SpotCard from "../../src/components/SpotCard";
import ReviewCard from "../../src/components/ReviewCard";
import ImageUpload from "../../src/components/ImageUpload";
import { handleUpload } from "../../src/utils/imageUpload";
import { getImagePromise } from "../../src/utils/getImagePromise";

const fetcher = (url: string) => axios.get(url).then((res) => res.data.user);

const userPage: React.FC = () => {
  const { currentUser } = useContext(AuthContext);
  const [avatarSrc, setAvatarSrc] = useState<any | null>();
  const [avatarFiles, setAvatarFiles] = useState<File[]>([]);
  const router = useRouter();
  const { id } = router.query;
  const { data: user, error } = useSWR<User>("/api/users/" + id, fetcher);
  const [loading, setLoading] = useState<boolean>(false);
  const [newUserName, setNewUserName] = useState<string>("");
  const toast = useToast();

  useEffect(() => {
    // imageがnullの時imageを取得
    if (id != undefined) {
      getAvatar(`users/resized/${id}_150x150`);
    }
  }, [id]);

  const getAvatar = useCallback(async (path: string) => {
    getImagePromise(path).then((res) => {
      setAvatarSrc(res);
    });
  }, []);

  // このメソッドビミョい
  const updateUser = async () => {
    setLoading(true);
    if (avatarFiles.length > 0) {
      handleUpload(`/users/${id}`, avatarFiles);
      toast({
        title: "プロフィール画像を更新しました。更新には時間がかかることがあります。",
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
        }
      })
      .then(() => {
        setLoading(false);
        toast({
          title: "ユーザーネームを更新しました",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        router.reload()
      });
  };

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
                {user.spots.reverse().map((spot: Spot, i) => {
                  if (currentUser == undefined || user.id !== currentUser.id) {
                    if (spot.is_anonymous) return;
                  }
                  return <SpotCard key={i} spot={spot} />;
                })}
              </Stack>
            </TabPanel>
            <TabPanel>
              <Stack>
                {user.reviews.map((review: Review, i) => {
                  return <ReviewCard review={review} key={i} />;
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
