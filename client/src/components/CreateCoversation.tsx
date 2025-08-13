import { useEffect, useState } from "react";
import axios from "../lib/axios";

type User = {
  id: string;
  name: string;
};

export const CreateConversation = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch users filtered by search query
  const fetchUsers = async (query: string) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get<{ users: User[] }>(
        `/user/users/${encodeURIComponent(query)}`
      );
      setUsers(res.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search input
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers(search);
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  // Start conversation by sending user id
  const startConversation = async (userId: string) => {
    try {
      await axios.post("/conversations/", { to: userId });
      console.log("Conversation started with:", userId);
      // Optional: redirect or update conversation list here
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
    
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-900 shadow-lg rounded-md overflow-hidden">
      {/* Search Input */}
      <div className="p-4 border-b border-gray-700 bg-gray-800">
        <input
          type="text"
          placeholder="Search or start new chat"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-full bg-gray-700 border border-gray-600 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#25D366]"
        />
      </div>

      {/* User List */}
      <div className="max-h-[400px] overflow-y-auto bg-gray-900">
        <ul>
          {loading && (
            <li className="p-4 text-center text-gray-400">Searching...</li>
          )}
          {!loading && users.length === 0 && search.trim() && (
            <li className="p-4 text-center text-gray-400">No users found</li>
          )}
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => startConversation(user.id)}
              className="flex items-center gap-4 p-4 hover:bg-gray-800 cursor-pointer"
            >
              <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-100">{user.name}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
