export interface PlaceSearch {
  place_id: string;
  lat: number;
  lng: number;
  formatted_address?: string | null;
  business_status?: google.maps.places.BusinessStatus | null;
  google_maps_URI?: string | null;
  city: string;
  national_phone_number?: string | null;
  display_name?: string | null;
  place_status?: "DONE" | "IN_PROGRESS" | "TO_DO" | "NOT_EXIST" | "CLOSED";
  created_at?: Date;
}
