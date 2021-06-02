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
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

function New() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  function onSubmit(values: string) {
    alert(JSON.stringify(values, null, 2));
  }

  return (
    <main>
      <Center p={5}>
        <div>
          <Heading pb={10} color={useColorModeValue("gray.900", "white")}>
            新しいスポットを投稿する
          </Heading>
          <Stack spacing={5}>
            <Heading size="md" color={useColorModeValue("gray.900", "white")}>
              スポット情報
            </Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl isInvalid={errors.name}>
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
                isLoading={isSubmitting}
                type="submit"
              >
                投稿
              </Button>
            </form>
          </Stack>
        </div>
      </Center>
    </main>
  );
}

export default New;
