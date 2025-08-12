export const LoadingScreen = () => {
  return (
    <div className="flex justify-center w-screen h-screen items-center">
      <div className="rounded-xl bg-gray-200 p-3 shadow-md backdrop-blur-sm">
        <div className="text-center">
          <p>Please wait.</p>
          <p>This may take a while as server is booting...</p>
        </div>
        <div className="flex justify-center flex-row gap-2 m-3">
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:0s]"></div>
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:0.1s]"></div>
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:0.2s]"></div>
        </div>
      </div>
    </div>
  );
};
