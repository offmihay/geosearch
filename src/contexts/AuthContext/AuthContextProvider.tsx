import { useEffect, useState } from "react";
import { LoginField } from "../../types/LoginField.type";
import { useLoginMutation } from "../../queries/auth.query";
import { useNavigate, useLocation } from "react-router-dom";
import { notification } from "antd";
import AuthContext from "./AuthContext";
import { useAdminAccessQuery } from "../../queries/user.query";

interface AuthContextProviderProps {
  children: React.ReactNode;
}

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [token, setToken] = useState<string>(localStorage.getItem("token") || "");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const localStorageToken = localStorage.getItem("token") || "";
    if (localStorageToken !== token) {
      setToken(localStorageToken);
    }
  }, [token, location.pathname]);

  const loginMutation = useLoginMutation();
  const adminAccessQuery = useAdminAccessQuery();

  const login = async (userData: LoginField) => {
    loginMutation.mutate(userData, {
      onSuccess: (response: { token: string }) => {
        setToken(response.token);
        localStorage.setItem("token", response.token);
        adminAccessQuery.refetch();
        navigate("");
      },
      onError: (error) => {
        notification.error({
          message: "Помилка",
          description: `${error.message}`,
        });
      },
    });
  };

  const logOut = () => {
    localStorage.clear();
    setToken("");
    navigate("login");
  };

  const AuthContextValue = {
    login,
    logOut,
    token,
  };
  return <AuthContext.Provider value={AuthContextValue}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
