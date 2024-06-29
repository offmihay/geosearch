import { Button, Form, Input, Progress, message, notification } from "antd";
import { useState } from "react";
import { useAddPlacesMutation } from "../queries/queries";

function FindPlacesPage() {
  const addPlacesMutation = useAddPlacesMutation();
  const [form] = Form.useForm();
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [uniquePlaces, setUniquePlaces] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    setIsLoading(true);
    try {
      const values = await form.validateFields();
      const { Place } = (await google.maps.importLibrary("places")) as google.maps.PlacesLibrary;
      const [lat1, lng1] = values.bottomLeft.split(",").map(Number);
      const [lat2, lng2] = values.topRight.split(",").map(Number);
      const radius = Number(values.radius);

      if (isNaN(lat1) || isNaN(lng1) || isNaN(lat2) || isNaN(lng2) || isNaN(radius)) {
        notification.error({
          message: "Помилка",
          description: `Невірно вказані дані`,
        });
        return;
      }

      if (lat1 >= lat2 || lng1 >= lng2) {
        notification.error({
          message: "Помилка",
          description: `Невірно вказані координати. Правильний формат: (Ліва Нижня, Права Верхня)`,
        });
        return;
      }

      const step = Math.round((radius / 111111) * 1.35 * 10000) / 10000;
      const placesCollected: object[] = [];
      const totalSteps = Math.ceil((lat2 - lat1) / step) * Math.ceil((lng2 - lng1) / step);
      setProgress({ done: 0, total: totalSteps });

      for (let lat = lat1; lat < lat2; lat += step) {
        for (let lng = lng1; lng < lng2; lng += step) {
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
            includedPrimaryTypes: ["pet_store", "veterinary_care"],
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
            };
            placesCollected.push(placeObj);
            // console.log(placeObj);
          });

          setProgress((prev) => ({ done: prev.done + 1, total: prev.total }));
        }
      }

      const filterDuplicates = (array: any, key: any) => {
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
      message.error(error);
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
        console.error("Сталась помилка при відправленні даних", error);
      },
    });
  };

  return (
    <>
      <div className="m-4">
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="Bottom-left coordinates"
            name="bottomLeft"
            rules={[{ required: true, message: "Please input bottom-left coordinates (lat,lng)" }]}
          >
            <Input placeholder="lat,lng" />
          </Form.Item>
          <Form.Item
            label="Top-right coordinates"
            name="topRight"
            rules={[{ required: true, message: "Please input top-right coordinates (lat,lng)" }]}
          >
            <Input placeholder="lat,lng" />
          </Form.Item>
          <Form.Item
            label="Radius"
            name="radius"
            rules={[{ required: true, message: "Please input radius" }]}
          >
            <Input placeholder="radius" />
          </Form.Item>
        </Form>
        <Button onClick={handleStart}>Click me</Button>
        <Progress type="circle" percent={+((progress.done / progress.total) * 100).toFixed(2)} />
        <Button onClick={handleSend} disabled={uniquePlaces.length == 0 || isLoading}>
          Click me
        </Button>
      </div>
    </>
  );
}

export default FindPlacesPage;
