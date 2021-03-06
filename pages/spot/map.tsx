import {
  Stack,
  Center,
  Box,
  Flex,
  Spacer,
  SimpleGrid,
  Text,
} from "@chakra-ui/layout";
import Head from "next/head";
import axios from "../../constants/axios";
import { Spot } from "../../types/spot";
import useSWR from "swr";
import { useState } from "react";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverCloseButton,
} from "@chakra-ui/react";
import { Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useRouter } from "next/router";

const containerStyle = {
  ViewWidth: "100%",
  height: "80vh",
};

const center = {
  lat: 36,
  lng: 138,
};

const AllSpotMap: React.FC = () => {
  const fetcher = (url: string) => axios.get(url).then((res) => res.data.spots);
  const { data: spots, error } = useSWR<Spot[]>(`/api/spots/map`, fetcher);
  const apiKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "0";
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [spotData, setSpotData] = useState<Spot | null>(null);
  const router = useRouter();

  const openAndShow = (spot: Spot) => {
    setSpotData(spot);
    setIsOpen(true);
  };

  if (error) return <h1>error</h1>;
  if (!spots)
    return (
      <Center>
        <Stack p={8} w="2xl">
          loading...
        </Stack>
      </Center>
    );

  return (
    <div>
      <Head>
        <title>SkateSpot</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Center>
        <Stack p={8} w="full">
          <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              zoom={4}
              center={center}
            >
              {spots.map((spot: Spot) => {
                return (
                  <Marker
                    onClick={() => openAndShow(spot)}
                    position={{ lat: spot.lat, lng: spot.lng }}
                    label={"🛹"}
                  />
                );
              })}
            </GoogleMap>
          </LoadScript>
          <Popover
            isOpen={isOpen}
            closeOnBlur={true}
            onClose={() => setIsOpen(false)}
            placement="top"
            strategy="fixed"
          >
            <PopoverContent p={5}>
              <PopoverCloseButton />
              {spotData != null && (
                <>
                  <Text mb={2}>{spotData.name}</Text>
                  <Button
                    size="sm"
                    onClick={() => router.push("/spot/" + spotData.id)}
                  >
                    見る
                  </Button>
                </>
              )}
            </PopoverContent>
          </Popover>
        </Stack>
      </Center>
    </div>
  );
};
export default AllSpotMap;
