import { useMutation, useQuery } from "@tanstack/react-query";
import { getJson, postJson } from "../api/api";
import { UserPreferencesDtoType } from "../types/UserPreferencesDto.type";
import { UserPreferencesType } from "../types/UserPreferences.type";

export const useUserPreferencesQuery = () => {
  return useQuery({
    queryKey: [`user-preferences`],
    queryFn: (): Promise<UserPreferencesDtoType> => getJson("user/preferences"),
    retry: 3,
    refetchOnWindowFocus: false,
  });
};

export const useUserPreferencesMutation = () => {
  return useMutation({
    mutationKey: [`user-preferences`],
    mutationFn: (userPreferences: { preferences: UserPreferencesType }) =>
      postJson("user/preferences", userPreferences),
    retry: 0,
  });
};
