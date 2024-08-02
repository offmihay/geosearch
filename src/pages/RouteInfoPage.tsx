import { useParams } from "react-router-dom";
import { Button, Card, FloatButton, Popconfirm, Select, Spin, notification } from "antd";
import { PlaceSearch, PlaceStatus } from "../types/PlaceSearch.type";
import {
  CloudUploadOutlined,
  EnvironmentOutlined,
  GoogleOutlined,
  QuestionCircleOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useUpdatePlaceStatusMutation } from "../queries/place.query";
import { useCurrPlaceQuery } from "../queries/route.query";
import { placeStatusLabel } from "../components/RouteStatsTable/RouteStatsTable";
import useIsMobile from "../hooks/useIsMobile";

const RouteInfoPage = () => {
  const { id } = useParams();
  const isMobile = useIsMobile();
  const [userLocation, setUserLocation] = useState<{ lat: string; lng: string } | {}>({});
  const [isNearest, setIsNearest] = useState(false);
  const [isActiveQuery, setIsActiveQuery] = useState(true);

  const currPlaceQuery = useCurrPlaceQuery(
    isActiveQuery,
    id,
    isNearest,
    "lat" in userLocation ? userLocation.lat : undefined,
    "lng" in userLocation ? userLocation.lng : undefined
  );

  useEffect(() => {
    currPlaceQuery.isSuccess && setIsActiveQuery(false);
  }, [currPlaceQuery.fetchStatus]);

  const updatePlaceStatusMutation = useUpdatePlaceStatusMutation();

  const [status, setStatus] = useState<PlaceStatus>(PlaceStatus.DONE);

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
        setStatus(PlaceStatus.DONE);
        setIsNearest(false);
        setUserLocation({});
        setIsActiveQuery(true);
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

  const handleFindNearest = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude.toString(),
            lng: position.coords.longitude.toString(),
          };
          setUserLocation(pos);
          setIsNearest(true);
          setIsActiveQuery(true);
        },
        (error) => {
          console.log(`Error getting location: ${error.message}`);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  };

  return (
    <>
      <div className="m-4 mt-16">
        <Spin spinning={currPlaceQuery.isFetching || updatePlaceStatusMutation.isPending}>
          <Card
            className="max-w-[600px] m-auto"
            title={`Точка - ${currPlaceQuery.data?.place?.display_name}`}
            styles={{ title: { textAlign: "center", fontSize: 20 } }}
          >
            {currPlaceQuery.data?.isEmpty && <>IT WAS LAST POINT</>}
            {!currPlaceQuery.data?.isEmpty && (
              <div className="flex gap-4 flex-col items-center">
                <Button
                  type="dashed"
                  style={{ width: 300, height: 50 }}
                  href={formUrl(params(currPlaceQuery.data?.place))}
                  target="_blank"
                  disabled={!currPlaceQuery.data?.place}
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
                  href={currPlaceQuery.data?.place?.google_maps_URI || ""}
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
                  options={placeStatusLabel.filter((status) =>
                    [PlaceStatus.DONE, PlaceStatus.NOT_EXIST, PlaceStatus.SKIP].includes(
                      status.value
                    )
                  )}
                  onChange={setStatus}
                />
                <Popconfirm
                  title="Відправити?"
                  icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                  onConfirm={() => {
                    if (currPlaceQuery.data?.place?.place_id) {
                      handleUpdateStatus(currPlaceQuery.data?.place.place_id, status);
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
                  okText="Так"
                  cancelText="Ні"
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
        <FloatButton
          icon={<EnvironmentOutlined style={{ fontSize: 25 }} />}
          shape="circle"
          style={{ right: isMobile ? 30 : 100, bottom: isMobile ? 30 : 100, width: 60, height: 60 }}
          className="flex justify-center items-center"
          onClick={() => handleFindNearest()}
        />
      </div>
    </>
  );
};

export default RouteInfoPage;
