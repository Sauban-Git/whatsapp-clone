import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingScreen } from "../components/LoadingScreen";
import type { UserInfoApi } from "../types/types";
import { useUserInfoStore } from "../store/userInfoStore";
import axios from "../lib/axios"

export const AuthInfo = () => {
  const navigate = useNavigate();
  const setUserInfo = useUserInfoStore((state) => state.setUserInfo);

  const checkUser = async () => {
    try {
      const { data } = await axios.get<{ user: UserInfoApi }>("/user/");
      console.log(data.user)
      setUserInfo(data.user);
      navigate("/home");
    } catch (error) {
      console.error("Looks like user isnt logged in: ", error);
      navigate("/signup");
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return <LoadingScreen />;
};
