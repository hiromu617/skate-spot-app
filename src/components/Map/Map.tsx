import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import firebase from "../../../constants/firebase";
import { AuthContext } from "../../context/Auth";
import { FC, useState, useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

type Props = {
  setPosition: React.Dispatch<React.SetStateAction<Position | null>>;
  position: Position | null;
};

const containerStyle = {
  ViewWidth: "400px",
  height: "400px",
};
const center = {
  lat: 35.69575,
  lng: 139.77521,
};
type Position = {
  lat: number;
  lng: number;
};

const Map: React.FC<Props> = ({ position, setPosition }) => {
  const apiKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || '0';
  // const fetchPrefecture = (latLng: Position) => {
  //   const geocoder = new window.google.maps.Geocoder();
  //   geocoder.geocode({ location: latLng }, (results, status) => {
  //     const filteredResults = results[0].address_components.filter((component) => {
  //       return component.types.indexOf("administrative_area_level_1") > -1;
  //     });
  //     console.log(filteredResults[0].long_name)
  //   })
  // };
  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={8}
        onClick={(e) => {
          // console.log(e);
          // fetchPrefecture({ lat: e.latLng.lat(), lng: e.latLng.lng()})
          setPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        }}
      >
        <Marker position={position} />
      </GoogleMap>
    </LoadScript>
  );
};
export default Map;
