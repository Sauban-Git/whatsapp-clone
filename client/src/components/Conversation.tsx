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
    <div className="bg-gray-900 text-white min-h-[100dvh] flex flex-col border-r border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-900 sticky top-0 z-10">
        {/* App Title */}
        <div className="text-2xl font-bold">WhatsApp</div>

        {/* Right-Side Buttons */}
        {searchDisplayState ? (
          <button onClick={() => setSearchDisplayState(false)}>
            <img className="w-8 h-8" src="/images/cut.svg" alt="Close" />
          </button>
        ) : (
          <div className=" flex justify-center">
            <button onClick={() => setSearchDisplayState(true)}>
              <img
                className="w-7 h-7"
                src="/images/addConversation.svg"
                alt="Add"
              />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {searchDisplayState ? <CreateConversation /> : <ConversationList />}
      </div>
    </div>
  );
};
