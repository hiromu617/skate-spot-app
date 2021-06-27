import { User } from "./user";
import { Spot } from "./spot";

export type Review = {
  id: number;
  content: string;
  rating: number;
  created_at: string;
  user: User;
  spot?: Spot;
};