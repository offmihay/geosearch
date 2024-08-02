import { Role } from "./enum/role.enum";
import { LoginField } from "./LoginField.type";

export type AuthContextType = {
  token: string;
  roles: Role[];
  username: string;
  login: (userData: LoginField) => Promise<void>;
  logOut: () => void;
  isAdmin: (role: Role) => void;
};
