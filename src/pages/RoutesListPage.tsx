import { useDeactivateRouteMutation, useRoutesQuery } from "../queries/queries";
import RouteCard from "../components/RouteCard";
import { RouteObj } from "../types/typeRoute";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";

function RoutesListPage() {
  const routesQuery = useRoutesQuery();
  const deactivateRouteMutation = useDeactivateRouteMutation();
  localStorage.setItem("suffixLink", "");

  const navigate = useNavigate();

  const deactivateRoute = (id: string) => {
    !!id &&
      deactivateRouteMutation.mutate(id, {
        onSuccess: () => {
          notification.success({
            message: "Успішно",
            description: "Маршрут деактивовано",
          });
          routesQuery.refetch();
        },
        onError: (error) => {
          notification.error({
            message: "Помилка",
            description: `Сталась помилка: ${error.message}`,
          });
        },
      });
  };

  return (
    <div className="m-4">
      <div className="flex flex-wrap-reverse flex-row-reverse gap-4 justify-center">
        {routesQuery.data?.map((route: RouteObj) => (
          <RouteCard
            key={route.name}
            percentage={route.route_status_percentage}
            routes_done={route.routes_done || 0}
            title={route.name}
            date={new Date(route.created_at).toLocaleString("ru-UA")}
            handleOpenCard={() => {
              navigate(`${route._id}`);
              localStorage.setItem("suffixLink", `${route._id}` || "");
            }}
            img_url={route.img_url}
            onDelete={() => deactivateRoute(route._id || "")}
            countRoute={route.places_id_set.length}
            is_active={route.is_active}
          />
        ))}
      </div>
    </div>
  );
}

export default RoutesListPage;
