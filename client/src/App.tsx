import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import { AuthInfo } from "./pages/AuthInfo";
import { Signup } from "./pages/Signup";
import { useWebSocket } from "./customHooks/useWebSocket";

function App() {
  useWebSocket();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loading" element={<AuthInfo />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
