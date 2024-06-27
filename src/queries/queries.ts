import { useQuery } from "@tanstack/react-query";
import { getJson } from "../api/api";

export const useBrandsQuery = (gender: string) => {
  return useQuery({
    queryKey: ["brands", gender],
    queryFn: () => getJson("api/brands", { gender }),
    initialData: [],
    enabled: gender != "none",
    refetchOnWindowFocus: false,
    retry: 0,
  });
};
