export type RouteObj = {
  _id?: string;
  name: string;
  img_url: string;
  places_id_set: string[];
  route_status_percentage?: string;
  is_active: boolean;
  created_at: Date;
};
