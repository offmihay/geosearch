import { LoginField } from "./LoginField.type";

export type AuthContextType = {
  token: string;
  login: (userData: LoginField) => Promise<void>;
  logOut: () => void;
};
