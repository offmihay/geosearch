export type ModalContextType = {
  active: string | null;
  open: (modalName: string | null) => void;
  close: () => void;
};
