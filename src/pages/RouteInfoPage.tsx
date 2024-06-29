import { useParams } from "react-router-dom";
import { useCertainPlaceQuery, useRoutesQuery } from "../queries/queries";

const RouteInfoPage = () => {
  const { id } = useParams();

  const routesQuery = useRoutesQuery();
  const route = routesQuery.data.filter((route) => route._id == id)[0];
  console.log(route.places_id_set);

  const certainPlaceQuery = useCertainPlaceQuery(route.places_id_set[0] || "");

  return <></>;
};

export default RouteInfoPage;
