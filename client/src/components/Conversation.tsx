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
    <div className="bg-gray-900 text-white">
      <div className="border flex justify-between">
        <div className="font-semibold text-3xl p-2">WhatsApp</div>

        {searchDisplayState ? (
          <div>
            <button onClick={() => setSearchDisplayState(false)}>
              <img className="w-10 my-2 mx-6" src="/images/cut.svg" alt="menu" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center gap-4 m-3">
            <div>
              <button onClick={() => setSearchDisplayState(true)}>
                <img
                  className="w-8"
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
      <div className="bg-red-500">
        {!searchDisplayState ? <ConversationList /> : <CreateConversation />}
      </div>
    </div>
  );
};
