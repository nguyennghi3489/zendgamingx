import { storeToRefs } from "pinia";
import { signupApi } from "~/services/auth";

export const useAuth = () => {
  const store = useAuthStore();
  const { user, isAuthenticated, loading, error } = storeToRefs(store);

  const signup = async (credentials: SignupRequest): Promise<User> => {
    try {
      store.loading = true;
      store.error = "";

      const response = await signupApi(credentials);

      const newUser = {
        id: Date.now(),
        username: credentials.username,
        email: credentials.email,
      };

      store.user = newUser;
      store.isAuthenticated = true;
      localStorage.setItem("token", response.access_token);
      localStorage.setItem("user", JSON.stringify(newUser));

      return newUser;
    } catch (err: unknown) {
      store.error = (err as Error).message || "Failed to signup";
      throw err;
    } finally {
      store.loading = false;
    }
  };

  const checkAuth = () => {
    try {
      const token = localStorage.getItem("token");
      return !!token;
    } catch (error) {
      console.warn("Unable to access localStorage:", error);
      return false;
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated,
    signup,
    checkAuth,
  };
};
