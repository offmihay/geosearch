import { useMutation, useQuery } from "@tanstack/react-query";
import { getJson, postJson } from "../api/api";
import { PlaceSearch } from "../types/PlaceSearch.type";

export const usePlacesQuery = () => {
  return useQuery({
    queryKey: ["places"],
    queryFn: (): Promise<PlaceSearch[]> => getJson("places"),
    initialData: [],
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useAddPlacesMutation = () => {
  return useMutation({
    mutationKey: ["add-places"],
    mutationFn: (values: PlaceSearch[]) => postJson("places", values),
    retry: 1,
  });
};

export const useUpdatePlaceStatusMutation = () => {
  return useMutation({
    mutationKey: ["update-place-status"],
    mutationFn: (values: { place_id: string; place_status: PlaceSearch["place_status"] }) =>
      postJson("places/update-status", values),
    retry: 1,
  });
};
