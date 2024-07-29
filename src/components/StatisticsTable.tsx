import { Form, notification, Popconfirm, Table, TableProps, Tag, Typography } from "antd";
import { StatisticsDataType } from "../types/StatisticsData.type";
import { useState } from "react";
import EditableCell from "./EditableCell";
import { usePatchPlacesMutation } from "../queries/place.query";
import { PlaceStatus } from "../types/PlaceSearch.type";

export const placeStatusLabel = [
  {
    value: PlaceStatus.TO_DO,
    label: "Вільна",
    color: "blue",
  },
  {
    value: PlaceStatus.DONE,
    label: "Зроблено",
    color: "green",
  },
  {
    value: PlaceStatus.PROGRESSING,
    label: "В процесі",
    color: "orange",
  },
  {
    value: PlaceStatus.NOT_EXIST,
    label: "Не існує",
    color: "red",
  },
  {
    value: PlaceStatus.SKIP,
    label: "Пропуск",
    color: "purple",
  },
];

interface StatisticsTableProps {
  dataSource: StatisticsDataType[];
}

const StatisticsTable: React.FC<StatisticsTableProps> = ({ dataSource }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(dataSource);
  const [editingKey, setEditingKey] = useState<string | number | bigint>("");

  const patchPlacesMutation = usePatchPlacesMutation();

  const isEditing = (record: StatisticsDataType) => record.key === editingKey;

  const edit = (record: Partial<StatisticsDataType> & { key: React.Key }) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as StatisticsDataType;

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
        const values = await form.validateFields();
        values["id"] = data[index]._id;
        patchPlacesMutation.mutate(values, {
          onSuccess: () => {
            notification.success({
              message: "Успішно",
              description: "Дані успішно змінено!",
            });
          },
          onError: () => {
            notification.error({
              message: "Помилка",
              description: "Сталась помилка. Спробуйте пізніше!",
            });
          },
        });
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "Назва точки",
      dataIndex: "display_name",
      key: "display_name",
      render: (text: string, record: StatisticsDataType) => (
        <a href={record.google_maps_URI} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
      editable: true,
      width: "10%",
    },
    {
      title: "Місто",
      dataIndex: "city",
      key: "city",
      editable: true,
      width: "10%",
    },
    {
      title: "Cтатус",
      dataIndex: "place_status",
      key: "place_status",
      editable: true,
      width: "10%",
      render: (key: string) => {
        const statusObj = placeStatusLabel.find((item) => item.value === key);
        return (
          <Tag color={statusObj?.color} key={key}>
            {statusObj?.label}
          </Tag>
        );
      },
    },
    {
      title: "Зроблено о:",
      dataIndex: "done_at",
      key: "done_at",
      render: (text: string) => <>{new Date(text).toLocaleString("ru-UA")}</>,
      width: "10%",
    },
    {
      title: "Користувач",
      dataIndex: "username",
      key: "username",
      width: "10%",
    },
    {
      title: "Оновлено о",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (text: string) => <>{new Date(text).toLocaleString("ru-UA")}</>,
      width: "10%",
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_: any, record: StatisticsDataType) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Popconfirm title="Sure to change?" onConfirm={() => save(record.key)}>
              <Typography.Link style={{ marginRight: 8 }}>Save</Typography.Link>
            </Popconfirm>
            <Typography.Link onClick={cancel} style={{ marginRight: 8 }}>
              Cancel
            </Typography.Link>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ""} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );
      },
      width: "10%",
    },
  ];

  const mergedColumns: TableProps["columns"] = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: StatisticsDataType) => ({
        record,
        inputType: col.dataIndex === "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
        scroll={{ x: "max-content" }}
      />
    </Form>
  );
};

export default StatisticsTable;
