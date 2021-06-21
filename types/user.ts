import { Spot } from "./spot";
import { Review } from "./review";
export type User = {
  name: string;
  id: number;
  uid: string;
  limit: boolean;
  spots: Spot[];
  reviews: Review[];
};
