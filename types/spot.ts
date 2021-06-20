import { User } from "./user";
import { Review } from "./review";

export type Spot = {
  name: string;
  id: number;
  description: string;
  score: number;
  lat: number;
  lng: number;
  prefectures: string;
  created_at: string;
  user: User;
  reviews: Review[];
  is_anonymous: boolean;
};
