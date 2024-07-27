import { useMutation, useQuery } from "@tanstack/react-query";
import { getJson, patchJson, postJson } from "../api/api";
import { PlaceSearch } from "../types/PlaceSearch.type";
import { StatisticsDataType } from "../types/StatisticsData.type";

export const usePlacesQuery = () => {
  return useQuery({
    queryKey: ["places"],
    queryFn: (): Promise<PlaceSearch[]> => getJson("places"),
    initialData: [],
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const usePatchPlacesMutation = () => {
  return useMutation({
    mutationKey: ["add-places"],
    mutationFn: (values: PlaceSearch) => patchJson(`places/${values.id}`, values),
    retry: 1,
  });
};

export const useTablePlacesQuery = () => {
  return useQuery({
    queryKey: ["table-places"],
    queryFn: (): Promise<StatisticsDataType[]> => getJson("places/done"),
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
