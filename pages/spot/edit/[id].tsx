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
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import Head from "next/head";
import axios from "../../../constants/axios";
import { useState, useContext, useEffect } from "react";
import Map from "../../../src/components/Map";
import { AuthContext } from "../../../src/context/Auth";
import ImageUpload from "../../../src/components/ImageUpload";
import firebase from "../../../constants/firebase";
import { useRouter } from "next/router";
import { quartersInYear } from "date-fns";

type FormData = {
  name: string;
  description: string;
  prefectures: string;
};

type Position = {
  lat: number;
  lng: number;
};

function SpotEdit() {
  const router = useRouter();
  const { id, name, description, lat, lng, prefectures, userid } = router.query;
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [position, setPosition] = useState<Position | null>(
    lat != undefined && lng !== undefined ? { lat: +lat, lng: +lng } : null
  );
  const [myFiles, setMyFiles] = useState<File[]>([]);
  const toast = useToast();
  const PrefecturesList = ["北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県","徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"];
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  useEffect(() => {
    // currentUserとspotのuserが一致しなければredirect
    if(!currentUser || userid == undefined|| currentUser.id != +userid){
      router.push('/')
    }
  }, [])

  const handleUpload = async (fileName: string) => {
    const storage = firebase.storage();
    try {
      // アップロード処理
      const uploadTask: any = storage.ref(`/spots/${fileName}`).put(myFiles[0]);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, next, error);
    } catch (error) {
      console.log("エラーキャッチ", error);
    }
  };

  const next = (snapshot: { bytesTransferred: number; totalBytes: number }) => {
    // 進行中のsnapshotを得る
    // アップロードの進行度を表示
    const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log(percent + "% done");
    console.log(snapshot);
  };

  const error = (error: any) => {
    alert(error);
  };

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
      .put("/api/spots/" + id, {
        spot: {
          name: data.name,
          description: data.description,
          prefectures: data.prefectures,
          lat: position.lat,
          lng: position.lng,
        },
      })
      .then((res) => {
        handleUpload(res.data.spot.id);
        setLoading(false);
        router.push(`/spot/${id}`);
        toast({
          title: "スポットを更新しました",
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
            スポットの編集
          </Heading>
          <Stack spacing={3}>
            <form onSubmit={onSubmit}>
              <ImageUpload myFiles={myFiles} setMyFiles={setMyFiles} />
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
                  defaultValue={name}
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
                  defaultValue={description}
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
                  defaultValue={prefectures}
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
                更新
              </Button>
            </form>
          </Stack>
        </Stack>
      </Center>
    </div>
  );
}

export default SpotEdit;
