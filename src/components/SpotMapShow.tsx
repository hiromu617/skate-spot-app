import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

type Props = {
  lat: number,
  lng: number,
};
const containerStyle = {
  ViewWidth: "400px",
  height: "350px",
};
type Position = {
  lat: number;
  lng: number;
};

const SpotMapShow: React.FC<Props> = ({ lat, lng}) => {
  const apiKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || '0';
  const position: Position = {lat: lat, lng: lng}

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position}
        zoom={10}
      >
        <Marker position={position} />
      </GoogleMap>
    </LoadScript>
  );
};
export default SpotMapShow;
