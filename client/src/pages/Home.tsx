import { Conversation } from "../components/Conversation";
import { Menu } from "../components/Menu";
import { Messages } from "../components/Messages";
import { Placeholder } from "../components/Placeholder";
import {
  useMessageDisplayStore,
} from "../store/messageDisplay";

export const Home = () => {
  const messageDisplay = useMessageDisplayStore(
    (state) => state.messageDisplay
  );

  return (
    <div className="sm:grid sm:grid-cols-13 bg-stone-900 text-white">
      <div className="hidden sm:block sm:col-span-1">
        <Menu />
      </div>
      <div className="sm:col-span-12 sm:grid sm:grid-cols-2">
        <div className="hidden sm:block sm:col-span-1">
          <Conversation />
        </div>
        <div className="sm:hidden">
          {!messageDisplay ? <Conversation /> : <Messages />}
        </div>
        <div className="hidden sm:block sm:col-span-1">
          {!messageDisplay ? <Placeholder /> : <Messages />}
        </div>
      </div>
    </div>
  );
};
