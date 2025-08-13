import { useSearchDisplayStore } from "../store/searchDisplayStore";
import { ConversationList } from "./ConversationList";
import { CreateConversation } from "./CreateCoversation";

export const Conversation = () => {
  const searchDisplayState = useSearchDisplayStore(
    (state) => state.searchDisplayState
  );
  const setSearchDisplayState = useSearchDisplayStore(
    (state) => state.setSearchDisplay
  );

  return (
    <div className="h-screen flex flex-col border-x border-gray-500">
      <div className="flex justify-between rounded-xl ">
        <div className="mx-3 my-2 text-2xl font-semibold">WhatsApp</div>

        {searchDisplayState ? (
          <div>
            <button onClick={() => setSearchDisplayState(false)}>
              <img className="w-8" src="/images/cut.svg" alt="menu" />
            </button>
          </div>
        ) : (
          <div className="flex gap-4 mx-3 my-2">
            <div>
              <button onClick={() => setSearchDisplayState(true)}>
                <img
                  className="w-6"
                  src="/images/addConversation.svg"
                  alt="Add conversation"
                />
              </button>
            </div>
            <div>
              <button>
                <img className="w-6" src="/images/menu.svg" alt="menu" />
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="p-3 flex-1 overflow-y-auto">
        {!searchDisplayState ? <ConversationList /> : <CreateConversation />}
      </div>
    </div>
  );
};
