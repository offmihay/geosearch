import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteJson, getJson, patchJson, postJson } from "../api/api";
import { PlaceSearch } from "../types/PlaceSearch.type";
import { RouteObj } from "../types/RouteObj.type";

export const useRoutesQuery = () => {
  return useQuery({
    queryKey: ["routes"],
    queryFn: (): Promise<RouteObj[]> => getJson("routes"),
    initialData: [],
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useAddRouteMutation = () => {
  return useMutation({
    mutationKey: ["add-route"],
    mutationFn: (values: RouteObj) => postJson("routes", values),
    retry: 1,
  });
};

export const useCurrPlaceQuery = (routeId?: string) => {
  return useQuery({
    queryKey: ["curr-place"],
    queryFn: (): Promise<{ isEmpty: boolean; place?: PlaceSearch }> =>
      getJson(`routes/${routeId}/curr-place`),
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!routeId,
  });
};

export const useDeactivateRouteMutation = () => {
  return useMutation({
    mutationKey: ["deactivate-route"],
    mutationFn: (routeId: string) => patchJson(`routes/${routeId}/deactivate`),
    retry: 1,
  });
};

export const useDeleteRouteMutation = () => {
  return useMutation({
    mutationKey: ["delete-route"],
    mutationFn: (routeId: string) => deleteJson(`routes/${routeId}`),
    retry: 1,
  });
};
