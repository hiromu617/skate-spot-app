import { Heading, Stack, Center, Flex, SimpleGrid } from "@chakra-ui/layout";
import { Button, Alert, AlertIcon } from "@chakra-ui/react";
import Head from "next/head";
import axios from "../constants/axios";
import Link from "next/link";
import { Spot } from "../types/spot";
import { Review } from "../types/review";
import { FiArrowRight } from "react-icons/fi";
import SpotCard from "../src/components/SpotCard/SpotCard";
import ReviewCard from "../src/components/ReviewCard/ReviewCard";

export const getServerSideProps = async () => {
  const res = await axios.get("/api/top/");
  const spots: Spot[] = res.data.spots;
  const reviews: Review[] = res.data.reviews;
  console.log(spots);
  console.log(reviews);
  return {
    props: {
      spots,
      reviews,
    },
  };
};

type Props = {
  spots: Spot[];
  reviews: Review[];
};

const Home: React.FC<Props> = ({ spots, reviews }) => {
  console.log(spots);
  console.log(reviews);
  return (
    <div>
      <Head>
        <title>SkateSpot</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Alert status="warning">
          <AlertIcon />
          このサービスはβ版です。投稿したデータは削除される可能性があります。
        </Alert>
        <Center>
          <Stack p={8} w={["2xl", null, null, "6xl"]}>
            <Heading>新着のスポット</Heading>
            <SimpleGrid columns={[1, null, 2, 4]} spacing={4}>
              {spots.map((spot) => {
                return <SpotCard key={spot.id} spot={spot} />;
              })}
            </SimpleGrid>
            <Link href="/spot">
              <Button rightIcon={<FiArrowRight />}>もっと見る</Button>
            </Link>
          </Stack>
        </Center>
        <Center>
          <Stack p={8} w={["2xl", null, null, "6xl"]}>
            <Heading>新着のレビュー</Heading>
            <SimpleGrid columns={[1, null, 2, 4]} spacing={4}>
              {reviews.map((review) => {
                if (typeof review.spot !== "undefined") {
                  return <ReviewCard key={review.id} review={review} />;
                }
              })}
            </SimpleGrid>
          </Stack>
        </Center>
      </main>
    </div>
  );
};
export default Home;
