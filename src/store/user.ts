import { create } from "zustand";
import { BASE_ENDPOINT } from "../config/base";

export type User = {
  user: {
    email: string;
    name: string;
    createdAt: string;
    id: string;
    isAuthenticated: boolean;
  };
  getUserPayload: () => Promise<{
    email: string;
    name: string;
    createdAt: string;
    id: string;
    isAuthenticated: boolean;
  }>;
};

export const useUser = create<User>()((set, get) => ({
  user: {
    email: "",
    name: "",
    createdAt: "",
    id: "",
    isAuthenticated: false,
  },
  getUserPayload: async () => {
    const response = await fetch(`${BASE_ENDPOINT}/auth/profile`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const payload = await response.json();
    // console.log(payload, "userPayload");
    set((state) => {
      state.user = { ...state.user, ...payload };
      return state;
    });

    localStorage.setItem("userPayload", JSON.stringify(payload));
    // console.log(payload, "profile payload");
    if (payload.id) {
      set((state) => {
        return {
          ...state,
          ...payload,
        };
      });
      return get().user;
    } else {
      set((state) => {
        state.user = {
          id: "",
          email: "",
          name: "",
          createdAt: "",
          isAuthenticated: false,
        };

        return state;
      });
      return get().user;
    }
  },
}));
