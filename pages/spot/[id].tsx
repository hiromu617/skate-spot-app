import axios from "../../constants/axios"
import useSWR from 'swr'
import { useRouter } from 'next/router';

const fetcher = (url: string) => axios.get(url).then(res => res.data)

const spotShow: React.FC= () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: spot, error } = useSWR('/api/spots/'+id, fetcher)
  
  if (error) return <div>failed to load</div>
  if (!spot) return <div>loading...</div>

  return (
    <div>
      <h1>{spot.id}</h1>
      <h1>{spot.name}</h1>
    </div>
  );
}

export default spotShow;
