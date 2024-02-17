import Register from "./Components/Register";
import Login from "./Components/Login";
import PublicNote from "./Components/PublicNote";
import Home from "./Components/Home";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <div className="app">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/viewNote/:publicIdentifier" element={<PublicNote />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<h1>404 Page Not Found</h1>} />
        </Routes>
      </AuthProvider>
    </div>
  );
};

export default App;
