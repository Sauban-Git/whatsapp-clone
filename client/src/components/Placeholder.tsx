export const Placeholder = () => {
  return (
    <div>
      <div className="col-span-8 items-center flex justify-center h-screen">
        <div className="text-center">
          <div className="items-center flex-col justify-center">
            <img className="w-sm" src="/images/conversation.svg" alt="Conversations" />
          </div>
          <div>
            <h1 className="text-3xl my-5">WhatsApp web</h1>
            <p className="text-sm">
              Send and recieve messages without keeping your phone online.
              <br />
              Use Whatsapp on up to 4 linked devices and 1 phone at the time.
            </p>
            <div className="flex gap-3 justify-center mt-8">
              <img className="w-5" src="/images/encrypted.svg" alt="encrypted"/>
              <p>Your personal messages are end to end encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
