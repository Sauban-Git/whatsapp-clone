import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingScreen } from "../components/LoadingScreen";

export const AuthInfo = () => {
  const navigate = useNavigate();

  const checkUser = async () => {
    try {
      await axios.get("/user/");
      navigate("/home");
    } catch (error) {
      console.error("Looks like user isnt logged in: ", error);
      navigate("/signup");
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return <LoadingScreen />;
};
