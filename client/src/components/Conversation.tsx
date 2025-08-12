import { ConversationList } from "./ConversationList";

export const Conversation = () => {
  return (
    <div className="h-screen flex flex-col border-x border-gray-500">
      <div className="flex justify-between rounded-xl ">
        <div className="mx-3 my-2 text-2xl font-semibold">WhatsApp</div>
        <div className="flex gap-4 mx-3 my-2">
          <div>
            <button>
              <img className="w-6" src="/images/addConversation.svg" alt="Add conversation" />
            </button>
          </div>
          <div>
            <button>
              <img className="w-6" src="/images/menu.svg" alt="menu"/>
            </button>
          </div>
        </div>
      </div>
      <div className="p-3 flex-1 overflow-y-auto">
        <ConversationList />
      </div>
    </div>
  );
};
