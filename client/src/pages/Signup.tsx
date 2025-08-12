import { useRef, useState } from "react";
import axios from "../lib/axios";

export const Signup = () => {
  const [loading, setloading] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const submit = async () => {
    setloading(true);
    const name = nameRef.current?.value;
    const phoneNumber = phoneRef.current?.value;
    if (!name || !phoneNumber) return;
    try {
      await axios.post("/user/", {
        name,
        phoneNumber,
      });
    } catch (error) {
      console.error("Error while axios fetching", error);
    } finally {
        setloading(false)
    }
  };

  return (
    <div>
      <div className="relative m-5">
        <label className="absolute -top-2 left-3 px-1 bg-white text-sm text-gray-400 z-10">
          Name
        </label>
        <input
          type="text"
          ref={nameRef}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      </div>

      <div className="relative m-5">
        <label className="absolute -top-2 left-3 px-1 bg-white text-sm text-gray-400 z-10">
          Phone Number
        </label>
        <input
          type="tel"
          pattern="[0-9]{10}"
          ref={phoneRef}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      </div>
      <div className="relative m-5">
        <button disabled={loading} onClick={submit}>Submit</button>
      </div>
    </div>
  );
};
