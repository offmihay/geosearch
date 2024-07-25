import { AdminPreferencesType, UserPreferencesType } from "./preferences.type";

export type UserPreferencesDtoType = {
  preferences: UserPreferencesType;
  preferences_possibleValues?: UserPreferencesType;
};

export type AdminPreferencesDtoType = {
  preferences: AdminPreferencesType;
  preferences_possibleValues?: AdminPreferencesType;
};
