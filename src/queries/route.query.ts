import { useMutation, useQuery } from "@tanstack/react-query";
import { getJson, patchJson, postJson } from "../api/api";
import { PlaceSearch } from "../types/PlaceSearch.type";
import { RouteObj } from "../types/RouteObj.type";

export const useRoutesQuery = (checkedAll: boolean) => {
  return useQuery({
    queryKey: ["routes"],
    queryFn: (): Promise<RouteObj[]> => getJson("routes"),
    initialData: [],
    refetchOnWindowFocus: false,
    retry: 0,
    enabled: !checkedAll,
  });
};

export const useAllRoutesQuery = (checkedAll: boolean) => {
  return useQuery({
    queryKey: ["all-routes"],
    queryFn: (): Promise<RouteObj[]> => getJson("routes/all"),
    initialData: [],
    refetchOnWindowFocus: false,
    retry: 0,
    enabled: checkedAll,
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