import { Button, Card, Form, Input, Progress, Select, notification } from "antd";
import { useEffect, useRef, useState } from "react";
import { RocketOutlined, PlayCircleOutlined, CloseOutlined } from "@ant-design/icons";
import * as turf from "@turf/turf";
import { Feature, Polygon, GeoJsonProperties } from "geojson";
import { PlaceSearch } from "../types/PlaceSearch.type";
import { useAddPlacesMutation } from "../queries/place.query";

const regions = [
  "Cherkasy",
  "Chernihiv",
  "Chernivtsi",
  "Crimea",
  "Dnipropetrovsk",
  "Donetsk",
  "Ivano-Frankivsk",
  "Kharkiv",
  "Kherson",
  "Khmelnytskyy",
  "Kyiv",
  "Kirovohrad",
  "Luhansk",
  "Lviv",
  "Mykolayiv",
  "Odessa",
  "Poltava",
  "Rivne",
  "Sumy",
  "Ternopil",
  "Vinnytsya",
  "Volyn",
  "Zakarpattia",
  "Zaporizhia",
  "Zhytomyr",
];

function FindPlacesPage() {
  const addPlacesMutation = useAddPlacesMutation();
  const [form] = Form.useForm();
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [uniquePlaces, setUniquePlaces] = useState<PlaceSearch[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const isResetRef = useRef(false);

  const [polygon, setPolygon] = useState<Feature<Polygon, GeoJsonProperties> | null>(null);
  const [region, setRegion] = useState("");

  const fetchPolygon = async (region: string) => {
    try {
      const response = await fetch(`/regions/${region}.json`);
      if (!response.ok) {
        throw new Error(`Error fetching the file: ${response.statusText}`);
      }
      const data = await response.json();
      const polygonCoordinates = data.geometry.coordinates[0];
      const polygonData = turf.polygon([polygonCoordinates]);
      setPolygon(polygonData);
      console.log(`Successfully loaded polygon: ${region}`);
    } catch (err) {
      console.error("Error reading file:", err);
    }
  };

  useEffect(() => {
    if (region) {
      fetchPolygon(region);
    }
  }, [region]);

  const handleReset = () => {
    isResetRef.current = true;
  };

  const handleStart = async () => {
    const values = await form.validateFields().catch(() => {
      notification.warning({
        message: "Помилка",
        description: `Неправильно введені дані`,
      });
      return null;
    });

    if (!polygon) {
      return;
    }

    setIsLoading(true);
    try {
      const { Place } = (await google.maps.importLibrary("places")) as google.maps.PlacesLibrary;
      const [lat1, lng1] = values.bottomLeft.split(",").map(Number);
      const [lat2, lng2] = values.topRight.split(",").map(Number);
      const radius = Number(values.radius);

      if (isNaN(lat1) || isNaN(lng1) || isNaN(lat2) || isNaN(lng2) || isNaN(radius)) {
        notification.error({
          message: "Помилка",
          description: `Невірно вказані дані`,
        });
        setIsLoading(false);
        return;
      }

      if (lat1 >= lat2 || lng1 >= lng2) {
        notification.error({
          message: "Помилка",
          description: `Неправильно вказані координати`,
        });
        setIsLoading(false);
        return;
      }

      const step = Math.round((radius / 111111) * 1.35 * 10000) / 10000;
      const placesCollected: PlaceSearch[] = [];
      const totalSteps = Math.ceil((lat2 - lat1) / step) * Math.ceil((lng2 - lng1) / step);
      setProgress({ done: 0, total: totalSteps });

      for (let lat = lat1; lat < lat2; lat += step) {
        for (let lng = lng1; lng < lng2; lng += step) {
          const point = turf.point([lng, lat]);

          if (turf.booleanPointInPolygon(point, polygon)) {
            if (isResetRef.current) {
              isResetRef.current = false;
              setProgress({ done: 0, total: totalSteps });
              setUniquePlaces([]);
              setIsLoading(false);
              return;
            }

            const center = new google.maps.LatLng(lat, lng);
            const request = {
              fields: [
                "id",
                "location",
                "formattedAddress",
                "businessStatus",
                "googleMapsURI",
                "nationalPhoneNumber",
                "displayName",
                "plusCode",
              ],
              locationRestriction: { center, radius },
              includedTypes: ["pet_store", "veterinary_care"],
              language: "uk",
            };
            const { places } = await Place.searchNearby(request);

            if (places.length > 19) {
              console.log("NO WAY");
            }
            places.forEach((place) => {
              let cityName = "";
              try {
                if (place.plusCode?.compoundCode) {
                  const parts = place.plusCode.compoundCode.split(" ");
                  if (parts.length > 1) {
                    const potentialCityName = parts.slice(1).join(" ");
                    cityName = potentialCityName.split(",")[0].trim();
                  }
                }
              } catch {}

              const placeObj = {
                place_id: place.id,
                lat: place.location?.lat() || 0,
                lng: place.location?.lng() || 0,
                formatted_address: place.formattedAddress,
                business_status: place.businessStatus,
                google_maps_URI: place.googleMapsURI,
                city: cityName,
                national_phone_number: place.nationalPhoneNumber,
                display_name: place.displayName,
                region: region,
              };
              placesCollected.push(placeObj);
              console.log(placeObj);
            });
          }
          setProgress((prev) => ({ done: prev.done + 1, total: prev.total }));
        }
      }

      const filterDuplicates = (array: PlaceSearch[], key: string) => {
        const seen = new Set();
        return array.filter((item: any) => {
          const value = item[key];
          if (seen.has(value)) {
            return false;
          }
          seen.add(value);
          return true;
        });
      };

      const uniquePlaces = filterDuplicates(placesCollected, "place_id");
      setUniquePlaces(uniquePlaces);
    } catch (error: any) {
      notification.error({
        message: "Помилка",
        description: `Сталась помилка при проходженні скіпта. Спробуйте ще раз`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    addPlacesMutation.mutate(uniquePlaces, {
      onSuccess: () => {
        notification.success({
          message: "Успішно",
          description: "Локації додано успішно!",
        });
        setUniquePlaces([]);
      },
      onError: (error) => {
        notification.error({
          message: "Помилка",
          description: `Сталась помилка при відправленні даних: ${error.message}`,
        });
      },
    });
  };

  return (
    <>
      <div className="m-4">
        <Card
          className="max-w-[600px] m-auto"
          title="Знайти точки"
          styles={{ title: { textAlign: "center", fontSize: 20 } }}
        >
          <div className="flex flex-col items-center">
            <Form
              form={form}
              layout="horizontal"
              labelCol={{ span: 14 }}
              wrapperCol={{ span: 20 }}
              style={{ maxWidth: 800 }}
              className="flex flex-col"
            >
              <Form.Item label="Регіон" name="region">
                <Select
                  placeholder="Please select"
                  options={regions.map((item: string) => ({
                    label: item,
                    value: item,
                  }))}
                  onChange={setRegion}
                />
              </Form.Item>
              <Form.Item
                label="Нижня-ліва координата"
                name="bottomLeft"
                rules={[
                  {
                    required: true,
                    message: "",
                  },
                  {
                    pattern:
                      /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?((1[0-7]\d)|([1-9]?\d))(\.\d+)?$/,
                    message: "",
                  },
                ]}
              >
                <Input placeholder="lat, lng" disabled={!polygon} />
              </Form.Item>
              <Form.Item
                label="Верхня-права координата"
                name="topRight"
                rules={[
                  {
                    required: true,
                    message: "",
                  },
                  {
                    pattern:
                      /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?((1[0-7]\d)|([1-9]?\d))(\.\d+)?$/,
                    message: "",
                  },
                ]}
              >
                <Input placeholder="lat, lng" disabled={!polygon} />
              </Form.Item>
              <Form.Item
                label="Радіус"
                name="radius"
                rules={[
                  { required: true, message: "" },
                  {
                    pattern: /^-?\d+(\.\d+)?$/,
                    message: "",
                  },
                  {
                    validator: (_, value) =>
                      value && Number(value) >= 300
                        ? Promise.resolve()
                        : Promise.reject(new Error("The number must be at least 300")),
                    message: "min: 300",
                  },
                ]}
              >
                <Input placeholder="500" disabled={!polygon} />
              </Form.Item>
            </Form>
            <div className="flex flex-col items-center gap-4 mt-4">
              <Button
                type="dashed"
                style={{ width: 300, height: 50 }}
                onClick={handleStart}
                disabled={isLoading}
              >
                <div className="flex items-center justify-center gap-2">
                  <PlayCircleOutlined style={{ fontSize: 25 }} />
                  <span style={{ fontSize: 16 }}>Почати пошук</span>
                </div>
              </Button>
              <Button
                type="dashed"
                style={{ width: 300, height: 50 }}
                onClick={handleReset}
                disabled={!isLoading}
              >
                <div className="flex items-center justify-center gap-2">
                  <CloseOutlined style={{ fontSize: 25 }} />
                  <span style={{ fontSize: 16 }}>Скинути</span>
                </div>
              </Button>
              <Progress
                type="circle"
                percent={+((progress.done / progress.total) * 100).toFixed(2)}
              />
              <Button
                type="primary"
                style={{ width: 300, height: 50 }}
                onClick={handleSend}
                disabled={uniquePlaces.length == 0 || isLoading}
              >
                <div className="flex items-center justify-center gap-2">
                  <RocketOutlined style={{ fontSize: 25 }} />
                  <span style={{ fontSize: 16 }}>Оновити інформацію</span>
                </div>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

export default FindPlacesPage;
