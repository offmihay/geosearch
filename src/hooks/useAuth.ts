import { useContext } from "react";
import AuthContext from "../contexts/AuthContext/AuthContext";

export const useAuth = () => {
  return useContext(AuthContext);
};
