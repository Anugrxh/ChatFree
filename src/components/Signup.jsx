// src/components/Signup.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

// --- SVG Icon Components for Password Toggle ---
const EyeIcon = ({ className }) => (
    <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);

const EyeOffIcon = ({ className }) => (
    <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
);


export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for visibility
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== password2) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    try {
      const userData = { username, email, password, password2 };
      const response = await axios.post("https://chatfreebackend.onrender.com/api/register", userData);
      
      console.log("Signup successful:", response.data);
      setSuccess("Account created successfully! Redirecting to login...");
      
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (apiError) {
      console.error("Signup failed:", apiError);
      setError(apiError.response?.data?.message || "An unknown error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignup = (provider) => {
    console.log(`OAuth Signup with ${provider}`);
    navigate("/home");
  };

  // --- Real-time password match check ---
  const passwordsDoMatch = password && password2 && password === password2;
  const passwordsDontMatch = password && password2 && password !== password2;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-950 to-black">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg"
      >
        <h2 className="text-3xl font-extrabold mb-2 text-center text-white">Sign Up</h2>
        
        {error && <p className="text-center text-red-400 bg-red-900/20 p-2 rounded-md mb-4">{error}</p>}
        {success && <p className="text-center text-green-400 bg-green-900/20 p-2 rounded-md mb-4">{success}</p>}

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:ring-2 focus:ring-green-500 outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:ring-2 focus:ring-green-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {/* --- Password Input with Toggle --- */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:ring-2 focus:ring-green-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
             <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white">
                {showPassword ? <EyeOffIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
            </button>
          </div>
          
          {/* --- Confirm Password Input with Toggle and Real-time Validation --- */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className={`w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-300 border transition-all ${
                passwordsDoMatch ? 'border-green-500 focus:ring-green-500' : 
                passwordsDontMatch ? 'border-red-500 focus:ring-red-500' : 
                'border-white/20 focus:ring-green-500'
              } outline-none`}
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
             <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white">
                {showPassword ? <EyeOffIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
            </button>
          </div>
          
          {/* --- Real-time feedback message --- */}
          {passwordsDontMatch && <p className="text-xs text-red-400 -mt-2 px-1">Passwords do not match.</p>}
          {passwordsDoMatch && <p className="text-xs text-green-400 -mt-2 px-1">Passwords match!</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 flex items-center">
          <span className="flex-1 border-t border-white/20"></span>
          <span className="px-4 text-gray-400">or</span>
          <span className="flex-1 border-t border-white/20"></span>
        </div>

        {/* <button
          onClick={() => handleOAuthSignup("Google")}
          className="mt-4 w-full py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition"
        >
          Continue with Google
        </button> */}

        <p className="mt-6 text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <Link to="/" className="text-blue-400 hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
