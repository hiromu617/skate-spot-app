import { User } from "./user";

export type Review = {
  id: number;
  content: string;
  rating: number;
  created_at: string;
  user: User;
};