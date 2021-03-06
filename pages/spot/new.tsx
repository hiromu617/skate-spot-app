import {
  Container,
  Heading,
  Center,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Stack,
  Button,
  useColorModeValue,
  useToast,
  Textarea,
  Select,
  Switch,
  Box,
  Text
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import Head from "next/head";
import axios from "../../constants/axios";
import { useState, useContext } from "react";
import Map from "../../src/components/Map/Map";
import { AuthContext } from "../../src/context/Auth";
import ImageUpload from "../../src/components/ImageUpload/ImageUpload";
import router from "next/router";
import { handleUpload } from "../../src/utils/imageUpload";

type FormData = {
  name: string;
  description: string;
  prefectures: string;
};

type Position = {
  lat: number;
  lng: number;
};

function New() {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [position, setPosition] = useState<Position | null>(null);
  const [myFiles, setMyFiles] = useState<File[]>([]);
  const toast = useToast();
  const PrefecturesList = [
    "北海道",
    "青森県",
    "岩手県",
    "宮城県",
    "秋田県",
    "山形県",
    "福島県",
    "茨城県",
    "栃木県",
    "群馬県",
    "埼玉県",
    "千葉県",
    "東京都",
    "神奈川県",
    "新潟県",
    "富山県",
    "石川県",
    "福井県",
    "山梨県",
    "長野県",
    "岐阜県",
    "静岡県",
    "愛知県",
    "三重県",
    "滋賀県",
    "京都府",
    "大阪府",
    "兵庫県",
    "奈良県",
    "和歌山県",
    "鳥取県",
    "島根県",
    "岡山県",
    "広島県",
    "山口県",
    "徳島県",
    "香川県",
    "愛媛県",
    "高知県",
    "福岡県",
    "佐賀県",
    "長崎県",
    "熊本県",
    "大分県",
    "宮崎県",
    "鹿児島県",
    "沖縄県",
  ];
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async (data) => {
    if (!currentUser) {
      toast({
        title: "ログインしてください",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (!position) {
      toast({
        title: "位置情報を設定してください",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    await axios
      .post("/api/spots/", {
        spot: {
          name: data.name,
          description: data.description,
          prefectures: data.prefectures,
          lat: position.lat,
          lng: position.lng,
          is_anonymous: isAnonymous,
          user_id: currentUser.id,
        },
      })
      .then((res) => {
        handleUpload(`/spots/${res.data.spot.id}`, myFiles);
        setLoading(false);
        router.push("/");
        toast({
          title: "スポットを投稿しました",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      });
  });

  return (
    <div>
      <Head>
        <title>SkateSpot</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Center p={5}>
        <Stack w={{ base: "90%", md: "500px" }}>
          <Heading color={useColorModeValue("gray.900", "white")}>
            新しいスポット
          </Heading>
          <Stack spacing={3}>
            <form onSubmit={onSubmit}>
              <FormControl>
                <FormLabel htmlFor="name">スポットの画像</FormLabel>
                <FormHelperText mb={3}>
                  スポットの画像を一枚アップロードすることができます
                </FormHelperText>
                <ImageUpload myFiles={myFiles} setMyFiles={setMyFiles}>
                  <Box borderWidth="1px" rounded={"md"} p={5} mb={5}>
                    <Text color="gray">
                      画像をドラッグ&ドロップもしくはここをクリックしてください
                    </Text>
                  </Box>
                </ImageUpload>
              </FormControl>
              {myFiles.length > 0 && (
                <Button onClick={() => setMyFiles([])} my={5}>
                  削除
                </Button>
              )}
              <FormControl isInvalid={!!errors.name} mb={5}>
                <FormLabel htmlFor="name">スポット名</FormLabel>
                <Input
                  id="name"
                  placeholder="なおこロード"
                  {...register("name", {
                    required: "この項目は必須です",
                    maxLength: {
                      value: 20,
                      message: "20文字以内で入力してください",
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.description} mb={5}>
                <FormLabel htmlFor="description">スポットの説明</FormLabel>
                <Textarea
                  id="description"
                  placeholder="路面がよくて、長良川と金華山が見える最高のスポットです。"
                  {...register("description", {
                    maxLength: {
                      value: 140,
                      message: "140文字以内で入力してください",
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.description && errors.description.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.prefectures} mb={5}>
                <FormLabel htmlFor="prefectures">都道府県</FormLabel>
                <Select
                  id="prefectures"
                  placeholder="都道府県"
                  {...register("prefectures", {
                    required: "この項目は必須です",
                  })}
                >
                  {PrefecturesList.map((p) => {
                    return <option value={p}>{p}</option>;
                  })}
                </Select>
                <FormErrorMessage>
                  {errors.prefectures && errors.prefectures.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl display="flex" alignItems="center" mb={5}>
                <FormLabel htmlFor="isAnonymous" mb="0">
                  匿名投稿にする
                </FormLabel>
                <Switch
                  id="isAnonymous"
                  onChange={() => setIsAnonymous(!isAnonymous)}
                />
              </FormControl>
              <FormControl isInvalid={!position} mb={5}>
                <FormLabel>位置情報</FormLabel>
                <FormHelperText mb={3}>
                  スポットの位置にピンを立ててください
                </FormHelperText>
                <Map setPosition={setPosition} position={position} />
              </FormControl>
              <Button
                size="lg"
                bg="purple.600"
                color={"white"}
                isLoading={loading}
                type="submit"
                loadingText="Submitting"
                _hover={{
                  bg: "purple.400",
                }}
              >
                投稿
              </Button>
            </form>
          </Stack>
        </Stack>
      </Center>
    </div>
  );
}

export default New;
