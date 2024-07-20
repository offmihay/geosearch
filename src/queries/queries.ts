import { useMutation, useQuery } from "@tanstack/react-query";
import { getJson, patchJson, postJson } from "../api/api";
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

export const useCurrPlaceQuery = (routeId?: string) => {
  return useQuery({
    queryKey: ["curr-place"],
    queryFn: (): Promise<{ isEmpty: boolean; place?: PlaceSearch }> =>
      getJson(`routes/${routeId}/curr-place`),
    refetchOnWindowFocus: false,
    retry: 0,
    enabled: !!routeId,
  });
};

export const useDeactivateRouteMutation = () => {
  return useMutation({
    mutationKey: ["deactivate-route"],
    mutationFn: (routeId: string) => patchJson(`routes/${routeId}/deactivate`),
    retry: 3,
  });
};

export const useUpdatePlaceStatusMutation = () => {
  return useMutation({
    mutationKey: ["update-place-status"],
    mutationFn: (values: { place_id: string; place_status: PlaceSearch["place_status"] }) =>
      postJson("places/update-status", values),
    retry: 3,
  });
};
