import type { User } from "./auth";

export interface Participant {
  id: string | number;
  name: string;
  email: string;
  user: User;
}
