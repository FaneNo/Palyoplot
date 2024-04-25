import "./App.css";
import Home from "./pages/home";
import Registration from "./pages/registration";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Profile from "./pages/profile";
import History from "./pages/history";
import Navbar from "./components/Navbar";
import BottomNav from "./components/bottomNav";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />{" "}
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Router>
      <BottomNav />
    </>
  );
}

export default App;
