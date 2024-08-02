import React, { useState } from "react";
import { Button, Card, DatePicker, Form, notification } from "antd";
import PlacesStatsTable from "../components/PlacesStatsTable";
import { useStatsPlacesMutation } from "../queries/place.query";
import { PlaceStatsType } from "../types/PlaceStats.type";

const { RangePicker } = DatePicker;

const StatisticsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<PlaceStatsType[] | []>([]);

  const statsPlacesMutation = useStatsPlacesMutation();

  const handleSend = async () => {
    try {
      setData([]);
      const values = await form.validateFields();
      statsPlacesMutation.mutate(values.daterange, {
        onSuccess: (data) => {
          if (data.length > 0) {
            const updatedData =
              data.map((elem, index) => ({
                ...elem,
                key: index,
              })) || [];

            setData(updatedData);
          } else {
            notification.info({
              message: "Не знайдено",
              description: `Не знайдено інформації за данний проміжок часу`,
            });
          }
        },
      });
    } catch (error) {
      console.error("Error validating form:", error);
    }
  };

  return (
    <div className="m-4">
      <Card>
        <Form form={form} layout="horizontal">
          <Form.Item label="Дата" name="daterange">
            <RangePicker />
          </Form.Item>
        </Form>
        <Button onClick={handleSend}>Пошук</Button>
      </Card>
      {data && data.length > 0 && <PlacesStatsTable dataSource={data} />}
    </div>
  );
};

export default StatisticsPage;
