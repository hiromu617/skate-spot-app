import axios from "../../constants/axios"
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await axios.get("/api/spots/" + context.params.id);
  const spot = res.data;
  return {
    props: {
      spot,
    },
  };
};

type Props = {
  spot: Spot;
};
type Spot = {
  name: string;
  id: number;
};

const spotShow: React.FC<Props> = ({ spot }) => {

  return (
    <div>
      <h1>{spot.id}</h1>
      <h1>{spot.name}</h1>
    </div>
  );
}

export default spotShow;
