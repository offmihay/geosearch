import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PrivateRoute = () => {
  const authContext = useAuth();
  if (window.location.pathname == "/" && authContext?.token) {
    localStorage.setItem("siderMenuActive", "create-route");
  }
  return authContext?.token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
