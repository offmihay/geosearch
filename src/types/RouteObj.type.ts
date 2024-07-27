import { PlaceSearch } from "./PlaceSearch.type";

export type RouteObj = {
  _id?: string;
  name: string;
  img_url: string;
  places_id_set: PlaceSearch["id"];
  is_active: boolean;
  created_at: Date;
  user: string;
  route_status_percentage?: string;
  routes_done?: number;
};
