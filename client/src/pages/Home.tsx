import { useNavigate } from "react-router-dom";
import { Conversation } from "../components/Conversation";
import { Menu } from "../components/Menu";
import { Messages } from "../components/Messages";
import { Placeholder } from "../components/Placeholder";
import { useMessageDisplayStore } from "../store/messageDisplayStore";
import { useUserInfoStore } from "../store/userInfoStore";
import type { UserInfoApi } from "../types/types";
import { useEffect } from "react";
import axios from "../lib/axios";

export const Home = () => {
  const navigate = useNavigate();
  const setUserInfo = useUserInfoStore((state) => state.setUserInfo);

  const checkUser = async () => {
    try {
      const { data } = await axios.get<{ user: UserInfoApi }>("/user/");
      console.log(data.user);
      setUserInfo(data.user);
    } catch (error) {
      console.error("Looks like user isnt logged in: ", error);
      navigate("/signup");
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const messageDisplay = useMessageDisplayStore(
    (state) => state.messageDisplay
  );

  return (
    <div className="sm:grid sm:grid-cols-13 bg-stone-900 text-white">
      <div className="hidden sm:block sm:col-span-1">
        <Menu />
      </div>
      <div className="sm:col-span-12 sm:grid sm:grid-cols-3">
        <div className="hidden sm:block sm:col-span-1">
          <Conversation />
        </div>
        <div className="sm:hidden">
          {!messageDisplay ? <Conversation /> : <Messages />}
        </div>
        <div className="hidden sm:block sm:col-span-2">
          {!messageDisplay ? <Placeholder /> : <Messages />}
        </div>
      </div>
    </div>
  );
};
