import { useNavigate } from "react-router-dom";
import { Conversation } from "../components/Conversation";
import { Menu } from "../components/Menu";
import { Messages } from "../components/Messages";
import { Placeholder } from "../components/Placeholder";
import { useMessageDisplayStore } from "../store/messageDisplayStore";
import { useUserInfoStore } from "../store/userInfoStore";
import { useEffect } from "react";

export const Home = () => {
  const navigate = useNavigate();
  const userInfo = useUserInfoStore((state) => state.userInfo);
  const messageDisplay = useMessageDisplayStore((state) => state.messageDisplay);

  useEffect(() => {
    if (!userInfo.id) {
      navigate("/loading");
    }
  }, [userInfo.id, navigate]);

  if (!userInfo.id) return null;

  return (
    <div className="md:grid md:grid-cols-18 bg-stone-900 text-white">
      <div className="hidden md:block md:col-span-1">
        <Menu />
      </div>
      <div className="col-span-17 md:grid md:grid-cols-3">
        <div className="hidden md:block md:col-span-1">
          <Conversation />
        </div>
        <div className="md:hidden col-span-2">
          {!messageDisplay ? <Conversation /> : <Messages />}
        </div>
        <div className="hidden md:block md:col-span-2 ">
          {!messageDisplay ? <Placeholder /> : <Messages />}
        </div>
      </div>
    </div>
  );
};
