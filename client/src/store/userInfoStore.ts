import { create } from "zustand";
import type { UserInfoApi } from "../types/types";

interface UserInfoStore {
  userInfo: UserInfoApi;
  setUserInfo: (value: UserInfoApi) => void;
}

export const useUserInfoStore = create<UserInfoStore>((set) => ({
  userInfo: {
    id: "",
    name: "",
    phoneNumber: "",
    createdAt: "",
    updatedAt: "",
  },
  setUserInfo: (value) => set({ userInfo: value }),
}));
