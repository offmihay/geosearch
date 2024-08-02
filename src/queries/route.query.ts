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

export const useCurrPlaceQuery = (
  isActiveQuery: boolean,
  routeId?: string,
  nearest?: boolean,
  lat?: string,
  lng?: string
) => {
  return useQuery({
    queryKey: ["curr-place", routeId, nearest, lat, lng],
    queryFn: (): Promise<{ isEmpty: boolean; place?: PlaceSearch }> =>
      getJson(`routes/${routeId}/curr-place`, undefined, {
        ...(nearest ? { nearest: nearest.toString() } : {}),
        ...(lat ? { lat } : {}),
        ...(lng ? { lng } : {}),
      }),
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: isActiveQuery && !!routeId,
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
