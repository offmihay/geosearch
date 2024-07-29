import { useEffect, useState } from "react";
import { LoginField } from "../../types/LoginField.type";
import { useLoginMutation } from "../../queries/auth.query";
import { useNavigate, useLocation } from "react-router-dom";
import { notification } from "antd";
import AuthContext from "./AuthContext";
import { Role } from "../../types/enum/role.enum";

interface AuthContextProviderProps {
  children: React.ReactNode;
}

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [token, setToken] = useState<string>(localStorage.getItem("token") || "");
  const [roles, setRoles] = useState<string[]>(() => {
    const savedRoles = localStorage.getItem("roles");
    return savedRoles ? JSON.parse(savedRoles) : [];
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const localStorageToken = localStorage.getItem("token");
    if (localStorageToken !== token) {
      setToken(localStorageToken || "");
    }

    const localStorageRoles = localStorage.getItem("roles");
    if (localStorageRoles) {
      const parsedRoles = JSON.parse(localStorageRoles);
      if (
        roles.length !== parsedRoles.length ||
        !roles.every((element, index) => element === parsedRoles[index])
      ) {
        setRoles(parsedRoles);
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (roles.length > 0) {
      localStorage.setItem("roles", JSON.stringify(roles));
    } else {
      localStorage.removeItem("roles");
    }
  }, [roles]);

  const loginMutation = useLoginMutation();

  const login = async (userData: LoginField) => {
    loginMutation.mutate(userData, {
      onSuccess: (response: { token: string; roles: string[] }) => {
        setToken(response.token);
        localStorage.setItem("token", response.token);
        setRoles(response.roles);
        localStorage.setItem("roles", JSON.stringify(roles));
        navigate("");
      },
      onError: () => {
        notification.error({
          message: "Помилка",
          description: "Неправильний логін чи пароль",
        });
      },
    });
  };

  const logOut = () => {
    localStorage.clear();
    window.location.reload();
    setToken("");
    setRoles([]);
    navigate("login");
  };

  const isAdmin = (role: Role) => {
    return roles.includes(role);
  };

  const AuthContextValue = {
    login,
    logOut,
    token,
    roles,
    isAdmin,
  };
  return <AuthContext.Provider value={AuthContextValue}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
