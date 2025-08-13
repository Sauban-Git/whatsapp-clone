export const Menu = () => {
  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col justify-between items-center py-4 border-r border-gray-800">
      {/* Top Icon */}
      <div>
        <button>
          <img className="w-6 h-6" src="/images/messages.svg" alt="Messages" />
        </button>
      </div>

      {/* Bottom Icon */}
      <div>
        <button>
          <img
            className="w-8 h-8 rounded-full"
            src="/images/profile.svg"
            alt="Profile"
          />
        </button>
      </div>
    </div>
  );
};
