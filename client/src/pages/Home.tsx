import { Conversation } from "../components/Conversation";
import { Menu } from "../components/Menu";
import { Messages } from "../components/Messages";
import { Placeholder } from "../components/Placeholder";
import { useMessageDisplayStore } from "../store/messageDisplay";

export const Home = () => {

  const messageDisplay = useMessageDisplayStore((state) => state.messageDisplay)

  return (
    <div className="grid grid-cols-13 bg-stone-900 text-white">
      <div className="col-span-1">
        <Menu />
      </div>
      <div className="col-span-4">
        <Conversation />
      </div>
      <div className="col-span-8">
        {(!messageDisplay)? <Placeholder />: <Messages/>}
      </div>
    </div>
  );
};
