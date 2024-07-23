import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PrivateRoute = () => {
  const authContext = useAuth();

  return authContext?.token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
