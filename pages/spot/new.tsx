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
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import Head from "next/head";
import axios from "../../constants/axios";
import {useState} from 'react'

type FormData = {
  name: string;
};

function New() {
  const [loading, setLoading] = useState<boolean>(false)
  const toast = useToast()

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true)
    await axios.post("/api/spots/", {
      spot: {
        name: data.name,
      },
    })
    .then(() => {
      setLoading(false)
      toast({
        title: "スポットを投稿しました",
        status: "success",
        duration: 5000,
        isClosable: true,
      })
    })
  });

  return (
    <div>
      <Head>
        <title>SkateSpot</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Center p={5}>
        <div>
          <Heading pb={10} color={useColorModeValue("gray.900", "white")}>
            新しいスポットを投稿
          </Heading>
          <Stack spacing={5}>
            <Heading size="md" color={useColorModeValue("gray.900", "white")}>
              スポット情報
            </Heading>
            <form onSubmit={onSubmit}>
              <FormControl isInvalid={!!errors.name}>
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
              <Button
                mt={4}
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
        </div>
      </Center>
    </div>
  );
}

export default New;
