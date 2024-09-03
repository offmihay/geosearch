import RouteCard from "../components/RouteCard";
import { RouteObj } from "../types/RouteObj.type";
import { useNavigate } from "react-router-dom";
import { notification, Spin } from "antd";
import {
  useRoutesQuery,
  useDeactivateRouteMutation,
  useDeleteRouteMutation,
} from "../queries/route.query";
import { useEffect, useState } from "react";

function RoutesListPage() {
  const [routesData, setRoutesData] = useState<RouteObj[]>([]);

  const routesQuery = useRoutesQuery();

  useEffect(() => {
    if (routesQuery.isSuccess) {
      const data = routesQuery.data.reverse();
      setRoutesData(data);
    }
  }, [routesQuery.isSuccess]);

  const deactivateRouteMutation = useDeactivateRouteMutation();
  const deleteRouteMutation = useDeleteRouteMutation();
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

  const deleteRoute = (id: string) => {
    !!id &&
      deleteRouteMutation.mutate(id, {
        onSuccess: () => {
          notification.success({
            message: "Успішно",
            description: "Маршрут видалено",
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
    <>
      <Spin fullscreen={true} spinning={routesQuery.isFetching}>
        {" "}
      </Spin>
      <div className="m-4">
        <div className="flex flex-wrap gap-4 max-md:justify-center">
          {routesData.length != 0 &&
            routesData.map((route: RouteObj) => {
              return (
                <RouteCard
                  key={route._id}
                  percentage={route.route_status_percentage}
                  routes_done={route.routes_done || 0}
                  title={route.name}
                  date={new Date(route.created_at).toLocaleString("ru-UA")}
                  handleOpenCard={() => {
                    navigate(`${route._id}`);
                    localStorage.setItem("suffixLink", `${route._id}` || "");
                  }}
                  img_url={route.img_url}
                  onDeactivate={() => deactivateRoute(route._id || "")}
                  onDelete={() => deleteRoute(route._id || "")}
                  countRoute={route.places_id_set?.length || 0}
                  is_active={route.is_active}
                />
              );
            })}
        </div>
      </div>
    </>
  );
}

export default RoutesListPage;
