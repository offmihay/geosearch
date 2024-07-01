import { useRoutesQuery } from "../queries/queries";
import RouteCard from "../components/RouteCard";
import { RouteObj } from "../types/typeRoute";
import { useNavigate } from "react-router-dom";

function RoutesListPage() {
  const routesQuery = useRoutesQuery();

  const navigate = useNavigate();

  return (
    <div className="m-4">
      <div className="flex flex-wrap gap-4 justify-center">
        {routesQuery.data?.map((route: RouteObj) => (
          <RouteCard
            key={route.name}
            percentage={route.route_status_percentage}
            title={route.name}
            date={new Date(route.created_at).toLocaleString("ru-UA")}
            handleOpenCard={() => navigate(`${route._id}`)}
            img_url={route.img_url}
            onDelete={() => {}}
          />
        ))}
      </div>
    </div>
  );
}

export default RoutesListPage;
