import { useMutation, useQuery } from "@tanstack/react-query";
import { getJson, postJson } from "../api/api";
import { PlaceSearch } from "../types/typePlaceSearch";
import { RouteObj } from "../types/typeRoute";

export const usePlacesQuery = () => {
  return useQuery({
    queryKey: ["places"],
    queryFn: (): Promise<PlaceSearch[]> => getJson("places"),
    initialData: [],
    refetchOnWindowFocus: false,
    retry: 0,
  });
};

export const useAddPlacesMutation = () => {
  return useMutation({
    mutationKey: ["add-places"],
    mutationFn: (values: PlaceSearch[]) => postJson("places", values),
    retry: 3,
  });
};

export const useRoutesQuery = () => {
  return useQuery({
    queryKey: ["routes"],
    queryFn: (): Promise<RouteObj[]> => getJson("routes"),
    initialData: [],
    refetchOnWindowFocus: false,
    retry: 0,
  });
};

export const useAddRouteMutation = () => {
  return useMutation({
    mutationKey: ["add-route"],
    mutationFn: (values: RouteObj) => postJson("routes", values),
    retry: 3,
  });
};

export const useCertainPlaceQuery = (id?: string) => {
  return useQuery({
    queryKey: ["place", id],
    queryFn: (): Promise<PlaceSearch> => getJson(`places/${id}`),
    refetchOnWindowFocus: false,
    retry: 0,
    enabled: !!id,
  });
};
