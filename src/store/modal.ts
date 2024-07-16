import { create } from "zustand";
import { BASE_ENDPOINT } from "../config/base";

type modal = {
  protectedmodals: {
    upload: boolean;
    register: boolean;
    login: boolean;
    loading: boolean;
  };
  localmodals: {
    upload: boolean;
    register: boolean;
    login: boolean;
    loading: boolean;
  };
  userPayload: {
    id: string;
    email: string;
    username: string;
  };
  authfailure: {
    success: boolean;
    message: string;
  };
  toggleloginModal: (newVal: boolean) => void;
  toggleregisterModal: (newVal: boolean) => void;
  toggleuploadModal: (newVal: boolean) => void;
  openModal: () => Promise<void>;
  invalidateLogin: () => void;
  invalidateRegister: () => void;
  invalidateUpload: () => void;
};
export const useModal = create<modal>()((set, get) => ({
  protectedmodals: {
    upload: false,
    register: false,
    login: false,
    loading: false,
  },
  authfailure: {
    success: false,
    message: "",
  },
  userPayload: {
    id: "",
    email: "",
    username: "",
  },
  localmodals: {
    upload: false,
    register: false,
    login: false,
    loading: false,
  },
  toggleloginModal: (newVal) =>
    set((state) => {
      // console.log(state.localmodals.login, " This is state.localmodals.login ");
      return {
        ...state,
        localmodals: {
          login: newVal,
          loading: false,
          register: false,
          upload: false,
        },
      };
    }),
  toggleregisterModal: (newVal) =>
    set((state) => {
      // console.log(state.localmodals.login, " This is state.localmodals.login ");
      return {
        ...state,
        localmodals: {
          login: false,
          loading: false,
          register: true,
          upload: newVal,
        },
      };
    }),
  toggleuploadModal: (newVal) =>
    set((state) => {
      return {
        ...state,
        localmodals: {
          login: false,
          loading: false,
          register: false,
          upload: newVal,
        },
        protectedmodals: {
          login: false,
          loading: false,
          register: false,
          upload: true,
        },
      };
    }),
  openModal: async () => {
    try {
      set((state) => {
        state.protectedmodals = { ...state.protectedmodals, loading: true };
        return state;
      });
      console.log(get().protectedmodals);
      const response = await fetch(`${BASE_ENDPOINT}/auth/profile`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const payload = await response.json();
      localStorage.setItem("userPayload", JSON.stringify(payload));
      // console.log(payload, "profile payload");
      if (payload.id) {
        set((state) => {
          return {
            ...state,
            localmodals: {
              login: false,
              loading: false,
              register: false,
              upload: true,
            },
            protectedmodals: {
              loading: false,
              login: false,
              register: false,
              upload: true,
            },
          };
        });
        // console.log(get().protectedmodals);
        get().toggleloginModal(false);
        get().toggleuploadModal(true);
        // console.log(get().protectedmodals, "protected modals");
      } else {
        set((state) => {
          state.userPayload = { id: "", email: "", username: "" };
          state.protectedmodals = {
            ...state.protectedmodals,
            register: false,
            login: true,
            loading: false,
            upload: false,
          };
          state.localmodals = {
            ...state.localmodals,
            login: true,
          };

          return state;
        });
        get().toggleloginModal(true);
        // console.log(get().protectedmodals);
      }
    } catch (error) {
      // console.log(error);
    }
  },
  invalidateLogin: () =>
    set((state) => {
      state.protectedmodals = {
        ...state.protectedmodals,
        loading: false,
        login: false,
      };
      return state;
    }),
  invalidateRegister: () =>
    set((state) => {
      state.protectedmodals = {
        ...state.protectedmodals,
        loading: false,
        register: false,
      };
      return state;
    }),
  invalidateUpload: () =>
    set((state) => {
      state.protectedmodals = {
        ...state.protectedmodals,
        loading: false,
        upload: false,
      };
      return state;
    }),
}));
