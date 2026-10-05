import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterBackground from "../../Images/background-image-3.jpg"
import { Users,Eye,EyeOff } from "lucide-react";
const Register=()=>{
    const navigate=useNavigate();
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [showPassword,setShowPassword]=useState(false);
    const [rememberMe,setRememberMe]=useState(false);
    const HandleRegister=()=>{
        if(!name || !email || !password){
            alert("please fill the details")
            return
        }
        const User={name,email,password}
        localStorage.setItem("User",JSON.stringify(User))
        alert("registration successful")

    }
   
    return(
        <>
       <div  className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
  style={{ backgroundImage: `url(${RegisterBackground})` }}>
    {/* background overlay */}
    <div className="absolute inset-0 bg-slate-960/70 backdrop-blur-xs"/>
     {/* Main Login Card */}
    <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-800 bg-[#0F172A]/90 p-8 shadow-2xl backdrop-blur-md">
       {/* Header Section */}
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

          <h2 className="mt-6 text-xl font-semibold text-white">
            Welcome to Register Page
          </h2>
        </div> 
           {/* Form Section */}
        <form onSubmit={HandleRegister} className="mt-6 space-y-4">
            {/* Name Field */}
            <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                Name
                </label>
                 <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
              className="w-full rounded-lg border border-slate-700/80 bg-slate-900/60 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            />
            </div>
          {/* Email Field */}
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

          {/* Password Field */}
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

          {/* Remember Me & Forgot Password */}
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

          
          </div>

          {/* Login Submit Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] transition-all duration-150 mt-2"
          >
            Register
          </button>
          <br></br>
              <button
            type="submit"
            className="w-full rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] transition-all duration-150 mt-2"
         onClick={()=>navigate("/login")} >
            Go to Login
          </button>
        </form>
    </div>
</div>
        </>
    )
}
export default Register