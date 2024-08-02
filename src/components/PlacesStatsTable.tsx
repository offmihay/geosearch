import { useState } from "react";
import { Table } from "antd";
import { PlaceStatsType } from "../types/PlaceStats.type";

interface PlacesStatsTableProps {
  dataSource: PlaceStatsType[];
}

const PlacesStatsTable: React.FC<PlacesStatsTableProps> = ({ dataSource }) => {
  const [data] = useState(dataSource);

  const columns = [
    {
      title: "Користувач",
      dataIndex: "username",
      key: "username",
      width: "10%",
    },
    {
      title: "Всього",
      dataIndex: "total",
      key: "total",
      width: "10%",
    },
    {
      title: "Не існує",
      dataIndex: "not_exist",
      key: "not_exist",
      width: "10%",
    },
    {
      title: "Зроблено",
      dataIndex: "done",
      key: "done",
      width: "10%",
    },
  ];

  return (
    <Table
      bordered
      dataSource={data}
      columns={columns}
      rowClassName="editable-row"
      scroll={{ x: "max-content" }}
    />
  );
};

export default PlacesStatsTable;
