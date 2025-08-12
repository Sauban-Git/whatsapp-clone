import { ConversationList } from "./ConversationList";

export const Conversation = () => {
  return (
    <div className="rounded-xl h-screen flex flex-col">
      <div className="flex justify-between p-3 rounded-xl ">
        <div>WhatsApp</div>
        <div className="flex gap-4">
          <div>
            <button>start</button>
          </div>
          <div>
            <button>menu</button>
          </div>
        </div>
      </div>
      <div className="p-3 flex-1 overflow-y-auto">
        <ConversationList />
      </div>
    </div>
  );
};
