import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Authenticaton-Folder/Pages/Login";
import Register from "./Authenticaton-Folder/Pages/Register";
import ProtectedRoute from "./Authenticaton-Folder/Components/Protectedroute";
import MainBoard from "./Dashboard/MainBar";

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainBoard />
            </ProtectedRoute>
          }
        />
        
        {/* Fixes "No routes matched location /dashboard/login" */}
        <Route path="/dashboard/login" element={<Navigate to="/login" replace />} />
        
        {/* Catch-all fallback for undefined paths */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;