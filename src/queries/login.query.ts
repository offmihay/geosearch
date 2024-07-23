import { useMutation } from "@tanstack/react-query";
import { postJson } from "../api/api";
import { LoginField } from "../types/LoginField.type";

export const useLoginMutation = () => {
  return useMutation({
    mutationKey: [`login`],
    mutationFn: (loginDto: LoginField) => postJson("auth/login", loginDto),
    retry: 0,
  });
};
