import "./App.css";
import Home from "./pages/home";
import Registration from "./pages/registration";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Profile from "./pages/profile";
import History from "./pages/history";
import Navbar from "./components/Navbar";
import BottomNav from "./components/bottomNav";
import About from "./pages/about";
import Tutorial from "./pages/tutorial";
import AuthorizedNav from "./components/authorizedNav";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Registration />;
}

function App() {
  return (
    <>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registration" element={<RegisterAndLogout />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
      <BottomNav />
    </>
  );
}

export default App;

// import "./App.css";
// import Home from "./pages/home";
// import Registration from "./pages/registration";
// import Dashboard from "./pages/dashboard";
// import Login from "./pages/login";
// import Profile from "./pages/profile";
// import History from "./pages/history";
// import Navbar from "./components/Navbar";
// import BottomNav from "./components/bottomNav";
// import About from "./pages/about";
// import Tutorial from "./pages/tutorial";
// import AuthorizedNav from "./components/authorizedNav";
// import {jwtDecode} from "jwt-decode"
// import api from "./api"
// import { REFRESH_TOKEN, ACCESS_TOKEN } from "./token";
// import { useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
//   Navigate,
// } from "react-router-dom";
// import ProtectedRoute from "./components/ProtectedRoute";

// function Logout() {
//   localStorage.clear();
//   return <Navigate to="/login" />;
// }

// function RegisterAndLogout() {
//   localStorage.clear();
//   return <Registration />;
// }

// function App() {
//   const [isAuthorized, setIsAuthorized] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     auth().catch(() => isAuthorized(false));
//   }, []);
//   useEffect(() => {
//     auth().finally(() => setIsLoading(false)); // Set loading to false when auth is done
//   }, []);

//   const refreshToken = async () => {
//     const refreshToken = localStorage.getItem(REFRESH_TOKEN);

//     //try to get a new token
//     //try to get a response to the /api/token/refresh/ (the backend) with the refresh token which will give us a new access token
//     try {
//       const res = await api.post("/api/token/refresh/", {
//         refresh: refreshToken,
//       });
//       //if it 200 (ok) then set the new access token
//       if (res.status === 200) {
//         localStorage.setItem(ACCESS_TOKEN, res.data.access);
//         setIsAuthorized(true);
//       } else {
//         setIsAuthorized(false);
//       }
//     } catch (error) {
//       console.log(error);
//       setIsAuthorized(false);
//     }
//   };

//   //check for access token if it expired or not
//   const auth = async () => {
//     const token = localStorage.getItem(ACCESS_TOKEN);
//     if (!token) {
//       setIsAuthorized(false);
//       return;
//     }
//     const decoded = jwtDecode(token); //give us expiration date
//     const tokenExpiration = decoded.exp;
//     const now = Date.now() / 1000;

//     //if the token is expired it will ask for new token
//     if (tokenExpiration < now) {
//       await refreshToken();
//     } else {
//       setIsAuthorized(true);
//     }
//   };
//   if (isLoading) {
//     return <div>Loading...</div>; // Or replace with a loading spinner
//   }
  
//   return (
//     <>
//       {isAuthorized ? <AuthorizedNav /> : <Navbar />}
//       <Router>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/registration" element={<RegisterAndLogout />} />
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route path="/login" element={<Login />} />
//           <Route path="/logout" element={<Logout />} />
//           <Route
//             path="/profile"
//             element={
//               <ProtectedRoute>
//                 <Profile />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/history"
//             element={
//               <ProtectedRoute>
//                 <History />
//               </ProtectedRoute>
//             }
//           />
//           <Route path="/tutorial" element={<Tutorial />} />
//           <Route path="/about" element={<About />} />
//         </Routes>
//       </Router>
//       <BottomNav />
//     </>
//   );
// }

// export default App;
