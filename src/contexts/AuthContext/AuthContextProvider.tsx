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
  const [username, setUsername] = useState<string>(localStorage.getItem("username") || "");
  const [roles, setRoles] = useState<Role[]>(() => {
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

    const localStorageUsername = localStorage.getItem("username");
    if (localStorageUsername !== username) {
      setToken(localStorageUsername || "");
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
    if (username) {
      localStorage.setItem("username", username);
    } else {
      localStorage.removeItem("username");
    }
  }, [username]);

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
      onSuccess: (response: { token: string; roles: Role[]; username: string }) => {
        setToken(response.token);
        localStorage.setItem("token", response.token);
        setUsername(response.username);
        localStorage.setItem("username", response.username);
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
    setUsername("");
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
    username,
    isAdmin,
  };
  return <AuthContext.Provider value={AuthContextValue}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
