import { useParams } from "react-router-dom";
import { Button, Card, Popconfirm, Select, Spin, notification } from "antd";
import { PlaceSearch } from "../types/PlaceSearch.type";
import {
  CloudUploadOutlined,
  GoogleOutlined,
  QuestionCircleOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useUpdatePlaceStatusMutation } from "../queries/place.query";
import { useCurrPlaceQuery } from "../queries/route.query";

const RouteInfoPage = () => {
  const { id } = useParams();

  const currPlaceQuery = useCurrPlaceQuery(id);
  const placeCurr = currPlaceQuery.data?.place;

  const updatePlaceStatusMutation = useUpdatePlaceStatusMutation();

  const statusOptions = [
    { value: "DONE", label: "Зроблено" },
    { value: "NOT_EXIST", label: "Відхилено" },
  ];

  const [status, setStatus] = useState<PlaceSearch["place_status"]>("DONE");

  const formUrl = (params: { [key: string]: any }) => {
    const url = new URL(
      "https://docs.google.com/forms/d/e/1FAIpQLSfkDsu7_UML3muXMvyrq2L9x4gAXUnshyA3SSqNFcH5vLIRug/viewform?usp=pp_url"
    );
    Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
    return url.toString();
  };

  const params = (place?: PlaceSearch) => {
    return {
      "entry.310662946": place?.national_phone_number,
      "entry.1664904206": place?.national_phone_number,
      "entry.628660627": place?.display_name,
      "entry.761657856": place?.formatted_address,
    };
  };

  const handleUpdateStatus = (id: string, status: PlaceSearch["place_status"]) => {
    const values = { place_id: id, place_status: status };
    updatePlaceStatusMutation.mutate(values, {
      onSuccess: () => {
        notification.success({
          message: "Успішно",
          description: "Місце зроблено",
          placement: "bottom",
        });
        setStatus("DONE");
        currPlaceQuery.refetch();
      },
      onError: (error) => {
        notification.error({
          message: "Помилка",
          description: `Сталась помилка: ${error.message}`,
          placement: "bottom",
        });
      },
    });
  };

  return (
    <>
      <div className="m-4 mt-16">
        <Spin spinning={currPlaceQuery.isFetching || updatePlaceStatusMutation.isPending}>
          <Card
            className="max-w-[600px] m-auto"
            title={`Точка - ${placeCurr?.display_name}`}
            styles={{ title: { textAlign: "center", fontSize: 20 } }}
          >
            {currPlaceQuery.data?.isEmpty && <>IT WAS LAST POINT</>}
            {!currPlaceQuery.data?.isEmpty && (
              <div className="flex gap-4 flex-col items-center">
                <Button
                  type="dashed"
                  style={{ width: 300, height: 50 }}
                  href={formUrl(params(placeCurr))}
                  target="_blank"
                  disabled={!placeCurr}
                >
                  <div className="flex items-center justify-center gap-2">
                    <SolutionOutlined style={{ fontSize: 25 }} />
                    <span style={{ fontSize: 16 }}>Гугл форма</span>
                  </div>
                </Button>
                <Button
                  type="dashed"
                  danger
                  style={{ width: 300, height: 50 }}
                  href={placeCurr?.google_maps_URI || ""}
                >
                  <div className="flex items-center justify-center gap-2">
                    <GoogleOutlined style={{ fontSize: 25 }} />
                    <span style={{ fontSize: 16 }}>Точка на карті</span>
                  </div>
                </Button>
                <Select
                  value={status}
                  style={{ width: 300, height: 50 }}
                  placeholder="Please select"
                  options={statusOptions}
                  onChange={setStatus}
                />
                <Popconfirm
                  title="Відправити?"
                  description="yes ?"
                  icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                  onConfirm={() => {
                    if (placeCurr?.place_id) {
                      handleUpdateStatus(placeCurr.place_id, status);
                    } else {
                      notification.error({
                        message: "Помилка",
                        description: "place_id не визначено",
                      });
                    }
                  }}
                  onPopupClick={(event) => {
                    event.stopPropagation();
                  }}
                  okText="da"
                  cancelText="ніт"
                  okButtonProps={{ className: "w-[60px] h-[30px]" }}
                  cancelButtonProps={{ className: "w-[60px] h-[30px]" }}
                  overlayClassName="w-[300px]"
                >
                  <Button type="primary" style={{ width: 300, height: 50, marginTop: 40 }}>
                    <div className="flex items-center justify-center gap-2">
                      <CloudUploadOutlined style={{ fontSize: 25 }} />
                      <span style={{ fontSize: 16 }}>Відправити</span>
                    </div>
                  </Button>
                </Popconfirm>
              </div>
            )}
          </Card>
        </Spin>
      </div>
    </>
  );
};

export default RouteInfoPage;
