import { useRef } from "react";
import axios from "../lib/axios";

export const Signup = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const submit = async () => {
    const name = nameRef.current?.value;
    const phoneNumber = phoneRef.current?.value;
    if (!name || !phoneNumber) return null;
    try {
      await axios.post("/user/", {
        name,
        phoneNumber,
      });
    } catch (error) {
      console.error("Error while axios fetching", error);
    }
  };

  return (
    <div>
      <div className="relative m-5">
        <label className="absolute -top-2 left-3 px-1 bg-white text-sm text-gray-400 z-10">
          Name
        </label>
        <input
          ref={nameRef}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      </div>

      <div className="relative m-5">
        <label className="absolute -top-2 left-3 px-1 bg-white text-sm text-gray-400 z-10">
          Phone Number
        </label>
        <input
          ref={phoneRef}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      </div>
      <div className="relative m-5">
        <button onClick={submit}>Submit</button>
      </div>
    </div>
  );
};
