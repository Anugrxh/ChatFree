import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

// --- SVG Icon Components for Password Toggle ---
const EyeIcon = ({ className }) => (
    <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);

const EyeOffIcon = ({ className }) => (
    <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
);


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const apiEndpoint = "http://localhost:5000/api/login";

      // --- THIS IS THE FIX ---
      // The backend now expects an 'email' key, not 'username'.
      const loginData = {
        email: email,
        password: password,
      };

      const response = await axios.post(apiEndpoint, loginData);
      const { token, ...userData } = response.data;
      
      login(userData, token);
      navigate("/home");

    } catch (apiError) {
      console.error("Login failed:", apiError);
      setError(apiError.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = (provider) => {
    console.log(`OAuth Login with ${provider}`);
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-950 to-black">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg"
      >
        <h2 className="text-3xl font-extrabold mb-4 text-center text-white">Login</h2>
        
        {error && <p className="text-center text-red-400 bg-red-900/20 p-2 rounded-md mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email" // Use type="email" for better validation
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)} required
          />
          {/* --- Password input with visibility toggle --- */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} // Toggle type based on state
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)} required
            />
            <button
                type="button" // Important: type="button" to prevent form submission
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white"
            >
                {showPassword ? <EyeOffIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 flex items-center">
          <span className="flex-1 border-t border-white/20"></span>
          <span className="px-4 text-gray-400">or</span>
          <span className="flex-1 border-t border-white/20"></span>
        </div>

        {/* <button
          onClick={() => handleOAuthLogin("Google")}
          className="mt-4 w-full py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition"
        >
          Continue with Google
        </button> */}

        <p className="mt-6 text-sm text-gray-400 text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
}
