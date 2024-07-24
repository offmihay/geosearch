import { useState } from "react";
import ModalContext from "./ModalContext";

interface ModalContextProviderProps {
  children: React.ReactNode;
}

const ModalContextProvider = ({ children }: ModalContextProviderProps) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (modalName: string | null) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  const ModalContextValue = {
    active: activeModal,
    open: (modalName: string | null) => {
      openModal(modalName);
    },
    close: () => {
      closeModal();
    },
  };
  return <ModalContext.Provider value={ModalContextValue}>{children}</ModalContext.Provider>;
};

export default ModalContextProvider;
