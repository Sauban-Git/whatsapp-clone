export const ConversationList = () => {
  const conversations = [
    {
      id: 1,
      title: "John Doe",
      lastMessage: "Hey, are we still on for tomorrow?",
    },
    {
      id: 2,
      title: "Project Team",
      lastMessage: "Final designs have been uploaded.",
    },
    {
      id: 3,
      title: "Sarah",
      lastMessage: "Call me when you're free.",
    },
    {
      id: 4,
      title: "Mom",
      lastMessage: "Don't forget to bring groceries!",
    },
    // Duplicate entries to simulate scroll
    ...Array.from({ length: 12 }, (_, i) => ({
      id: i + 5,
      title: `Chat ${i + 5}`,
      lastMessage: "Last message in this chat...",
    })),
  ];

  return (
    <ul className="overflow-y-auto h-full text-white p-2 space-y-2">
      {conversations.map((conv) => (
        <li
          key={conv.id}
          className="p-3 rounded-xl bg-[#2a2a2a] hover:bg-[#333] transition-colors cursor-pointer"
        >
          <p className="font-semibold text-white truncate">{conv.title}</p>
          <p className="text-sm text-gray-400 truncate">{conv.lastMessage}</p>
        </li>
      ))}
    </ul>
  );
};
