import { defineStore } from "pinia";

interface State {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string;
}

export const useAuthStore = defineStore("user", {
  state: (): State => ({
    user: null,
    loading: false,
    isAuthenticated: false,
    error: "",
  }),
});
