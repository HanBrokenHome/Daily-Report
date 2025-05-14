import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa6";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import '../../assets/index.css';
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [delay, setDelay] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
const navigate = useNavigate();
  const handleThemeToggle = (e) => {
    const { clientX, clientY } = e;
    const rippleId = Date.now();
    const newRipple = { id: rippleId, x: clientX, y: clientY };
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setDarkMode((prev) => !prev);
    }, 150);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 1000);
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token) {
      navigate('/Dashboard')
    }
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }, []);
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setDelay(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const datas = { username, password };
      const consume = await axios.post("http://localhost:8000/login", datas);
      const response = consume.data;
      const token = localStorage.setItem('token', response.token);
      console.log(response);
      console.log(token);
      showToast("success", "Login berhasil!");
      navigate('/Dashboard')
    } catch (error) {
      console.error(error.response.data.message);
      showToast("error", error.response?.data?.message || "Login gagal!");
    } finally {
      setDelay(false);
    }
  };
  return (
    <>
      <div
        data-theme={darkMode ? "dark" : "light"}
        className="relative min-h-screen bg-base-200 transition-colors duration-300 overflow-hidden"
      >
        {/* Ripple Effects */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute w-0 h-0 rounded-full bg-primary opacity-30 pointer-events-none animate-ripple"
            style={{
              top: ripple.y,
              left: ripple.x,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}

        {/* Theme Toggle */}
        <button
          onClick={handleThemeToggle}
          className="absolute top-4 right-4 text-xl p-2 rounded-full z-10 hover:bg-base-300 transition"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {toast && (
          <div
            className={`toast toast-top toast-end z-50`}
          >
            <div
              className={`alert ${
                toast.type === "success"
                  ? "alert-success"
                  : "alert-error"
              } shadow-lg relative`}
            >
              <span>{toast.message}</span>
              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-opacity-20 bg-black">
                <div className="h-full bg-white animate-toast-progress"></div>
              </div>
            </div>
          </div>
        )}

        {/* Login Card */}
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-base-100 shadow-xl rounded-2xl p-8 w-full max-w-md z-10">
            <h2 className="text-3xl font-bold mb-6 text-center font-[Inter]">Login</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Username"
                className="input focus:border-none border-slate-500 w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                    className="input focus:border-none border-slate-500 w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <button className="btn btn-primary w-full" disabled={delay}>
                {delay ? <span className="text-primary loading loading-infinity loading-xl"></span> : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
