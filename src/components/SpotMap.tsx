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
import firebase from "../../constants/firebase";
import { AuthContext } from "../context/Auth";
import { FC, useState, useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

type Props = {
  lat: number,
  lng: number,
};
const containerStyle = {
  ViewWidth: "400px",
  height: "400px",
};
type Position = {
  lat: number;
  lng: number;
};

const SpotMap: React.FC<Props> = ({ lat, lng}) => {
  const apiKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || '0';
  const position: Position = {lat: lat, lng: lng}

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position}
        zoom={15}
      >
        <Marker position={position} />
      </GoogleMap>
    </LoadScript>
  );
};
export default SpotMap;
