import { useEffect, useState } from "react";
import { useTablePlacesQuery } from "../queries/place.query";
import RouteStatsTable from "../components/RouteStatsTable/RouteStatsTable";

function HistoryPage() {
  const tablePlacesQuery = useTablePlacesQuery();

  const [isDataTransformed, setDataTransformed] = useState(false);

  useEffect(() => {
    if (tablePlacesQuery.isFetched) {
      tablePlacesQuery.data.forEach((elem) => {
        elem["key"] = elem._id;
      });
      tablePlacesQuery.data.sort(
        (a, b) => new Date(b.done_at).getTime() - new Date(a.done_at).getTime()
      );
      setDataTransformed(true);
    }
  }, [tablePlacesQuery.isFetched]);

  return (
    <div style={{ overflow: "auto" }} className="p-4">
      {isDataTransformed && <RouteStatsTable dataSource={tablePlacesQuery.data} />}
    </div>
  );
}

export default HistoryPage;
