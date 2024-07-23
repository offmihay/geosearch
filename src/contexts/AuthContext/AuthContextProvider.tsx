import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { LoginField } from "../../types/LoginField.type";
import { useLoginMutation } from "../../queries/login.query";
import { useNavigate, useLocation } from "react-router-dom";
import { notification } from "antd";

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

  const login = async (userData: LoginField) => {
    loginMutation.mutate(userData, {
      onSuccess: (response: { token: string }) => {
        setToken(response.token);
        localStorage.setItem("token", response.token);
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
