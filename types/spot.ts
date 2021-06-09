import { User } from "./user";

export type Spot = {
  name: string;
  id: number;
  description: string;
  lat: number;
  lng: number;
  prefectures: string;
  created_at: string;
  user: User;
};
