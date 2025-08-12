export const Menu = () => {
  return (
    <div className="flex flex-col justify-between p-3 h-screen rounded-xl">
      <div>
        <img className="w-10" src="/images/messages.svg" alt="messages" />
      </div>
      <div className="">
        <img className="rounded-full border-2 border-[#25D366] w-10" src="/images/profile.svg" alt="profile" />
      </div>
    </div>
  );
};
