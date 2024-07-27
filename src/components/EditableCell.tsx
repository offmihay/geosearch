import { Form, Input, InputNumber, Select, Tag } from "antd";
import { StatisticsDataType } from "../types/StatisticsData.type";
import { PlaceStatus } from "../types/PlaceSearch.type";
import { placeStatusLabel } from "./StatisticsTable";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: StatisticsDataType;
  index: number;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode =
    dataIndex === "place_status" ? (
      <Select>
        {Object.keys(PlaceStatus).map((key) => {
          const statusObj = placeStatusLabel.find((item) => item.value === key);
          return (
            <Select.Option key={key} value={key}>
              <Tag color={statusObj?.color} key={key}>
                {statusObj?.label}
              </Tag>
            </Select.Option>
          );
        })}
      </Select>
    ) : inputType === "number" ? (
      <InputNumber />
    ) : (
      <Input />
    );

  return (
    <td {...restProps} className="h-[50px]">
      {editing ? (
        <Form.Item className="mb-0" name={dataIndex}>
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default EditableCell;
