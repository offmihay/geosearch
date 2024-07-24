import { useContext } from "react";
import ModalContext from "../contexts/ModalContext/ModalContext";

export const useModal = () => {
  return useContext(ModalContext);
};
