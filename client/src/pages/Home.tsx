import { Conversation } from "../components/Conversation";
import { Menu } from "../components/Menu";

export const Home = () => {
  return (
    <div className="grid grid-cols-13 bg-stone-900 text-white">
      <div className="col-span-1">
        <Menu />
      </div>
      <div className="col-span-4">
        <Conversation />
      </div>
      <div className="col-span-8 text-center bg-blue-500">
        dlfkjhakgjhd;f lakfjdh ladjhfk fakjhfdkaj hwe iewh fiahi hiewhqi ad ci
        qhqiifewh iq wn poewijfq fnqwifewjqhp fieuwqpkdn q
      </div>
    </div>
  );
};
