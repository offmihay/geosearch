import { createContext } from "react";
import { AuthContextType } from "../../types/AuthContext.type";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
