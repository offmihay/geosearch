import { createContext } from "react";
import { ModalContextType } from "../../types/ModalContext.type";

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export default ModalContext;
