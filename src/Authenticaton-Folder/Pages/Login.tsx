import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseAuth } from "../Authentication/CreateContext";
import LoginBackgroundImage from "../../Images/background-image-1.jpg";
import { Users, Eye, EyeOff, X } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Forgot password modal state
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const { login } = UseAuth();
  const navigate = useNavigate();

  const HandleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const SavedData = localStorage.getItem("User");

    if (!SavedData) {
      alert("Please register first");
      return;
    }

    const User = JSON.parse(SavedData);

    if (User.email === email && User.password === password) {
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      login("fake-token");
       alert("login successfull")
      navigate("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const SavedData = localStorage.getItem("User");

    if (!SavedData) {
      setResetMessage("No user account found. Please register first.");
      return;
    }

    const User = JSON.parse(SavedData);

    if (User.email === resetEmail) {
      setResetMessage(`Your current password is: "${User.password}"`);
    } else {
      setResetMessage("Email not found in registered users.");
    }
  };

  return (
    <div
       className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center p-4"
      style={{ backgroundImage: `url(${LoginBackgroundImage})` }}

    >
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-800 bg-[#0F172A]/90 p-8 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/30">
            <Users className="h-6 w-6 text-white" />
          </div>

          <h1 className="bg-linear-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-2xl font-bold text-transparent">
            EmpManage
          </h1>
          <p className="mt-1 text-xs font-medium text-slate-400">
            Employee Management System
          </p>

          <h2 className="mt-6 text-xl font-semibold text-white">Welcome</h2>
          <p className="mt-1 text-xs text-slate-400">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={HandleLogin} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-300">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full rounded-lg border border-slate-700/80 bg-slate-900/60 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-slate-700/80 bg-slate-900/60 px-3.5 py-2.5 pr-10 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
              />
              Remember me
            </label>

            <button
              type="button"
              onClick={() => {
                setResetMessage("");
                setResetEmail("");
                setIsForgotOpen(true);
              }}
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 transition-all duration-150 mt-2"
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full rounded-lg border border-slate-700 bg-slate-800/80 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-700/80 transition-all duration-150"
          >
            Create an Account
          </button>
        </form>
        {/* Footer Link */}
        <div className=" flex items-center justify-center gap-3 mt-6 text-center text-xs text-slate-400">
          Don't have an account?{" "}
        <h5  className="text-blue-400  font-medium ml-1">Please create an account first</h5>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-2xl border border-slate-800 bg-[#0F172A] p-6 shadow-2xl">
            <button
              onClick={() => setIsForgotOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-semibold text-white mb-1">
              Reset Password
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your registered email to retrieve your password.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter registered email"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />

              {resetMessage && (
                <div className="rounded-md bg-blue-950/60 border border-blue-800/60 p-3 text-xs text-blue-300">
                  {resetMessage}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
              >
                Find Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;