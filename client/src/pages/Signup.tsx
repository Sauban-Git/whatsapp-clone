import { useRef, useState } from "react";
import axios from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const Signup = () => {
  const [loading, setloading] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const defaultId = async() => {
    setloading(true);
    try {
      await axios.get("/user/default/");
      navigate("/loading");
    } catch (error) {
      console.error("Error while axios fetching", error);
    } finally {
      setloading(false);
    }
  }

  const submit = async () => {
    setloading(true);
    const name = nameRef.current?.value;
    const phoneNumber = phoneRef.current?.value;
    if (!name || !phoneNumber) return setloading(false);
    try {
      await axios.post("/user/", {
        name,
        phoneNumber,
      });
      navigate("/loading");
    } catch (error) {
      console.error("Error while axios fetching", error);
    } finally {
      setloading(false);
    }
  };

  return (
    <div>
      <motion.div
        className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#25D350]">
            Sign In to Your Account
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              ref={nameRef}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D350]"
            />
            <input
              type="tel"
              inputMode="numeric"
              pattern="\d{10}"
              maxLength={10}
              placeholder="PhoneNumber: 9456372212"
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/\D/g, "");
              }}
              ref={phoneRef}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D350]"
            />

            <button
              disabled={loading}
              onClick={submit}
              className={`w-full py-2 font-semibold rounded-lg transition ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-[#25D350] hover:bg-[#25D366] text-white"
              }`}
            >
              {loading ? "Logging in..." : "Login to your account"}
            </button>
            <button
              disabled={loading}
              onClick={defaultId}
              className={`w-full py-2 font-semibold rounded-lg transition ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-[#25D350] hover:bg-[#25D366] text-white"
              }`}
            >
              {loading ? "Logging in..." : "Use Default ID"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
