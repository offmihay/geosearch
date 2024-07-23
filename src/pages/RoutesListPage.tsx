import RouteCard from "../components/RouteCard";
import { RouteObj } from "../types/RouteObj.type";
import { useNavigate } from "react-router-dom";
import { notification, Spin, Switch } from "antd";
import {
  useRoutesQuery,
  useDeactivateRouteMutation,
  useAllRoutesQuery,
} from "../queries/route.query";
import { useEffect, useState } from "react";

function RoutesListPage() {
  const [routesData, setRoutesData] = useState<RouteObj[]>([]);
  const [checked, setChecked] = useState(false);

  const onChange = (checked: boolean) => {
    setChecked(checked);
  };

  const routesQuery = useRoutesQuery(checked);
  const allRoutesQuery = useAllRoutesQuery(checked);

  useEffect(() => {
    setRoutesData(checked ? allRoutesQuery.data : routesQuery.data);
  }, [checked, routesQuery.fetchStatus, allRoutesQuery.fetchStatus]);

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
    <>
      <Switch
        checked={checked}
        onChange={onChange}
        className="absolute top-[-30px] right-[60px] z-50"
      />
      <Spin fullscreen={true} spinning={allRoutesQuery.isFetching || routesQuery.isFetching}>
        {" "}
      </Spin>
      <div className="m-4">
        <div className="flex flex-wrap-reverse flex-row-reverse gap-4 justify-center">
          {routesData &&
            routesData.map((route: RouteObj) => (
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
                onDelete={() => deactivateRoute(route._id || "")}
                countRoute={route.places_id_set.length}
                is_active={route.is_active}
              />
            ))}
        </div>
      </div>
    </>
  );
}

export default RoutesListPage;
