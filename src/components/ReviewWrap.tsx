import { Spot } from "../../types/spot";
import { User } from "../../types/user";
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
import {
  useToast,
  Textarea,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import axios from "../../constants/axios";
import { useState, useContext } from "react";
import router from "next/router";
import Rating from "react-rating";
import { StarIcon } from "@chakra-ui/icons";

type FormData = {
  content: string;
};

type Props = {
  spot: Spot;
  currentUser?: User | null;
};

const ReviewWrap: React.FC<Props> = ({ spot, currentUser }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();
  const toast = useToast();
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
    alert(`${data.content} ${rating}`);
  });
  return (
    <Stack p={4} w={{ base: "95%", md: "650px" }}>
      <Heading>Review</Heading>
      <Box borderWidth="1px" rounded={"md"} p={5}>
        <Flex pb={5}>
          <Rating
            initialRating={rating}
            onChange={(v) => setRating(v)}
            fractions={2}
            emptySymbol={<StarIcon boxSize={7} color="gray.100" />}
            fullSymbol={<StarIcon boxSize={7} color="yellow.300" />}
          />
        </Flex>
        <form onSubmit={onSubmit}>
          <FormControl isInvalid={!!errors.content} mb={5}>
            <Textarea
              id="content"
              placeholder="路面がよくて、長良川と金華山が見える最高のスポットです。"
              {...register("content", {
                required: "この項目は必須です",
                maxLength: {
                  value: 140,
                  message: "140文字以内で入力してください",
                },
              })}
            />
            <FormErrorMessage>
              {errors.content && errors.content.message}
            </FormErrorMessage>
          </FormControl>

          <Button
            size="md"
            bg="purple.600"
            color={"white"}
            isLoading={loading}
            type="submit"
            loadingText="Submitting"
            _hover={{
              bg: "purple.400",
            }}
          >
            レビューを投稿する
          </Button>
        </form>
      </Box>
    </Stack>
  );
};
export default ReviewWrap;
