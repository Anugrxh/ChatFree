// src/App.jsx

import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute"; // 1. Import PublicRoute

// No need for <Router> or <AuthProvider> here, they are in main.jsx

function App() {
  return (
    <div className="bg-black text-gray-200 min-h-screen">
      <Routes>
        {/* Public Routes: Logged-in users will be redirected away from these */}
        <Route
          path="/"
          element={
            <PublicRoute> {/* 2. Wrap the component */}
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute> {/* 3. Wrap the component */}
              <Signup />
            </PublicRoute>
          }
        />

        {/* Protected Routes: Logged-out users will be redirected to the login page */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
