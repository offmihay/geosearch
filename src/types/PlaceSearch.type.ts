export enum PlaceStatus {
  TO_DO = "TO_DO",
  DONE = "DONE",
  PROGRESSING = "PROGRESSING",
  NOT_EXIST = "NOT_EXIST",
  SKIP = "SKIP",
}

export type PlaceSearch = {
  id?: string;
  place_id: string;
  lat: number;
  lng: number;
  formatted_address?: string | null;
  business_status?: google.maps.places.BusinessStatus | null;
  google_maps_URI?: string | null;
  city?: string;
  national_phone_number?: string | null;
  display_name?: string | null;
  place_status?: PlaceStatus;
  created_at?: Date;
  user?: string;
};
