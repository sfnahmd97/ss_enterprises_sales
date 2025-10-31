import { create } from "zustand";
import api from "../lib/axios";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  relation_id: number;
  model: string;
  created_at: string;
  updated_at: string;
}

interface Token {
  accessToken: object;
  plainTextToken: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  response: {
    user: User;
    token: Token;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => {
  const savedToken = localStorage.getItem("auth_token");
  const savedUser = localStorage.getItem("auth_user");

  return {
    user: savedUser ? JSON.parse(savedUser) : null,
    token: savedToken,

    isAuthenticated: () => {
      const state = get();
      return !!state.token && !!state.user;
    },

    login: async (email, password) => {
      try {
        // ✅ Explicitly type the Axios response
        const res = await api.post<LoginResponse>("/login/sales", { email, password });

        const { success, message, response } = res.data;
        const { user, token } = response;

        const plainToken = token.plainTextToken;

        set({ token: plainToken, user });
        localStorage.setItem("auth_token", plainToken);
        localStorage.setItem("auth_user", JSON.stringify(user));

        return { success, message };
      } catch (error: any) {
        const message =
          error.response?.data?.message || "Login failed, please try again.";
        return { success: false, message };
      }
    },

    logout: () => {
      set({ token: null, user: null });
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    },
  };
});
