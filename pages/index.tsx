import { Heading, Stack, Center, Box, Text } from "@chakra-ui/layout";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import axios from "../constants/axios";
import Link from "next/link";
import {Spot} from "../types/spot"
import { LinkBox, LinkOverlay } from "@chakra-ui/react"

export const getServerSideProps = async () => {
  const res = await axios.get("/api/spots/");
  const spots = res.data;
  return {
    props: {
      spots,
    },
  };
};

type Props = {
  spots: Spot[];
};

const Home: React.FC<Props> = ({ spots }) => {
  console.log(spots);
  return (
    <div>
      <Head>
        <title>SkateSpot</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Center>
          <Stack p={8} w="lg">
            <Heading>新着のスポット</Heading>
            {spots.map((spot) => {
              return (
                <Link key={spot.id} href="/spot/[id]" as={`/spot/${spot.id}`}>
                  <Box borderWidth="1px" rounded={"md"} p={5}>
                    <Heading size="md">{spot.name}</Heading>
                  </Box>
                </Link>
              );
            })}
          </Stack>
        </Center>
      </main>
    </div>
  );
};
export default Home;
