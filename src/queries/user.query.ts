import { useMutation, useQuery } from "@tanstack/react-query";
import { getJson, postJson } from "../api/api";
import { AdminPreferencesDtoType, UserPreferencesDtoType } from "../types/PreferencesDto.type";
import { AdminPreferencesType, UserPreferencesType } from "../types/preferences.type";

export const useUserPreferencesQuery = () => {
  return useQuery({
    queryKey: [`user-preferences`],
    queryFn: (): Promise<UserPreferencesDtoType> => getJson("user/preferences"),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useUserPreferencesMutation = () => {
  return useMutation({
    mutationKey: [`user-preferences`],
    mutationFn: (userPreferences: { preferences: UserPreferencesType }) =>
      postJson("user/preferences", userPreferences),
    retry: 1,
  });
};

export const useAdminPreferencesQuery = () => {
  return useQuery({
    queryKey: [`admin-preferences`],
    queryFn: (): Promise<AdminPreferencesDtoType> => getJson("user/admin-preferences"),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useAdminPreferencesMutation = () => {
  return useMutation({
    mutationKey: [`admin-preferences`],
    mutationFn: (userPreferences: { preferences: AdminPreferencesType }) =>
      postJson("user/admin-preferences", userPreferences),
    retry: 1,
  });
};

export const useAdminAccessQuery = () => {
  return useQuery({
    queryKey: ["admin-access"],
    queryFn: () => getJson("user/admin-access"),
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: false,
  });
};
