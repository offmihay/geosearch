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
      title: "User",
      dataIndex: "username",
      key: "username",
      width: "10%",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: "10%",
    },
    {
      title: "Not exist",
      dataIndex: "not_exist",
      key: "not_exist",
      width: "10%",
    },
    {
      title: "DONE !",
      dataIndex: "done",
      key: "done",
      width: "10%",
      render: (text: string) => <p className="text-[18px] font-bold">{text}</p>,
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
