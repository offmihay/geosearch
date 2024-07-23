import { Button, Card, Form, Input, InputRef, Modal, Spin, notification } from "antd";
import { useEffect, useRef, useState } from "react";
import { SaveOutlined } from "@ant-design/icons";
import { PlaceSearch } from "../types/PlaceSearch.type";
import { usePlacesQuery } from "../queries/place.query";
import { useAddRouteMutation } from "../queries/route.query";

function CreateRoutePage() {
  const mapRef = useRef<google.maps.Map>();
  const inputRef = useRef<InputRef>(null);
  const routeRef = useRef<google.maps.DirectionsService | null>(null);

  const [startAddress, setStartAddress] = useState<string>("");
  const [, setIsAddressSelected] = useState<boolean>(false);

  const [selectedPlacesId, setSelectedPlacesId] = useState<string[]>([]);

  const [orderedPlacesId, setOrderedPlacesId] = useState<string[]>([]);
  const [form] = Form.useForm();

  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShowModal = (bool: boolean) => {
    setIsModalOpen(bool);
  };

  const toDataURL = (url: string) =>
    fetch(url)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );

  const generateStaticMapUrl = async (waypoints: { lat: number; lng: number }[]) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API;
    const baseUrl = "https://maps.googleapis.com/maps/api/staticmap";
    const size = "600x500";
    const markers = waypoints.map((point) => `markers=${point.lat},${point.lng}`).join("&");
    const url = `${baseUrl}?size=${size}&${markers}&key=${apiKey}`;

    return url;
  };

  const handleClickMarker = (
    id: string,
    marker: google.maps.marker.AdvancedMarkerElement,
    pinDefault: google.maps.marker.PinElement,
    pinSelected: google.maps.marker.PinElement
  ) => {
    setSelectedPlacesId((prevSelectedPlaces) => {
      if (prevSelectedPlaces.includes(id)) {
        marker.content = pinDefault.element;
        return prevSelectedPlaces.filter((place) => place !== id);
      } else {
        marker.content = pinSelected.element;
        return [...prevSelectedPlaces, id];
      }
    });
  };

  useEffect(() => {
    handleCreateMap();
  }, []);

  const placesQuery = usePlacesQuery();
  const addRouteMutation = useAddRouteMutation();

  useEffect(() => {
    isMapLoaded && placesQuery.isSuccess && handleSetMarkers();
  }, [isMapLoaded, placesQuery.isSuccess]);

  useEffect(() => {
    isModalOpen && handleLoadAutocomplete();
  }, [isModalOpen]);

  useEffect(() => {
    orderedPlacesId.length != 0 && handleFormSubmit();
  }, [orderedPlacesId]);

  const handleFormSubmit = async () => {
    try {
      const waypoints = orderedPlacesId
        .map((placeId) => {
          const place = placesQuery.data.find((place: PlaceSearch) => place.place_id === placeId);
          if (place) {
            return { lat: place.lat, lng: place.lng };
          }
          return null;
        })
        .filter((point): point is { lat: number; lng: number } => point !== null);

      await generateStaticMapUrl(waypoints)
        .then((url) => toDataURL(url))
        .then((dataUrl) => {
          form.setFieldsValue({
            places_id_set: orderedPlacesId,
            img_url: dataUrl,
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      const values = await form.validateFields();

      addRouteMutation.mutate(values, {
        onSuccess: () => {
          setIsMapLoaded(false);
          notification.success({
            message: "Успішно",
            description: "Маршрут успішно створено!",
          });
          handleShowModal(false);
          setOrderedPlacesId([]);
          setSelectedPlacesId([]);

          form.setFieldsValue({});
          handleCreateMap();
          placesQuery.refetch();
        },
        onError: (error) => {
          notification.error({
            message: "Помилка",
            description: `Сталась помилка при створення маршруту: ${error.message}`,
          });
        },
      });
    } catch (error) {
      notification.warning({
        message: "Помилка",
        description: `Перевірте чи правильно ви заповнили дані`,
      });
    }
  };

  const isFinished = (place: PlaceSearch) => {
    return place.place_status !== "TO_DO";
  };

  const handleLoadAutocomplete = async () => {
    const { Autocomplete } = (await google.maps.importLibrary(
      "places"
    )) as google.maps.PlacesLibrary;

    if (inputRef.current && inputRef.current.input) {
      const autocomplete = new Autocomplete(inputRef.current.input, {
        types: ["geocode"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place?.formatted_address) {
          setStartAddress(place.formatted_address);
          setIsAddressSelected(true);
        }
      });
    }
  };

  const handleSetMarkers = async () => {
    const map = mapRef.current!;
    const bounds = new google.maps.LatLngBounds();

    const { AdvancedMarkerElement } = (await google.maps.importLibrary(
      "marker"
    )) as google.maps.MarkerLibrary;

    if (placesQuery.isError) {
      return;
    }
    placesQuery.data.forEach((place: PlaceSearch) => {
      const pinDone = new google.maps.marker.PinElement({
        scale: 1,
        background: "#DCDCDC",
        borderColor: "#A9A9A9",
        glyphColor: "#A9A9A9",
      });

      const pinDefault = new google.maps.marker.PinElement({
        scale: 1,
        background: "#87CEFA",
        borderColor: "#4169E1",
        glyphColor: "#4169E1",
      });

      const pinSelected = new google.maps.marker.PinElement({
        scale: 1,
        background: "#2DEC59",
        borderColor: "#2FC351",
        glyphColor: "#2FC351",
      });

      const location = { lat: place.lat, lng: place.lng };

      const markerOptions = {
        map,
        position: location,
        title: place.place_id,
        gmpClickable: !isFinished(place),
        content: isFinished(place) ? pinDone.element : pinDefault.element,
        // collisionBehavior: google.maps.CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY,
      };

      const markerView = new AdvancedMarkerElement(markerOptions);

      if (!isFinished(place)) {
        markerView.addListener("click", () => {
          handleClickMarker(place.place_id, markerView, pinDefault, pinSelected);
        });
      }
      bounds.extend(location as unknown as google.maps.LatLng);
    });
    map.fitBounds(bounds);
  };

  const handleCreateMap = async () => {
    const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;

    const center = new google.maps.LatLng(49.2906, 31.19907);

    mapRef.current = new Map(document.getElementById("map")!, {
      center: center,
      zoom: 6,
      mapId: "d4f8bd35a29bd93f",
      disableDefaultUI: true,
      clickableIcons: false,
    });

    mapRef.current.addListener("tilesloaded", function () {
      setIsMapLoaded(true);
    });
  };

  const handleGetRoutes = async () => {
    const selectedRoute = selectedPlacesId;

    if (selectedRoute.length == 0) {
      console.error("Routes not found");
      return;
    }

    const { DirectionsService } = (await google.maps.importLibrary(
      "routes"
    )) as google.maps.RoutesLibrary;

    routeRef.current = new DirectionsService();
    const geocoder = new google.maps.Geocoder();

    // Geocode start address
    const startPlaceId = await geocodeAddress(geocoder, startAddress);

    if (!startPlaceId) {
      notification.warning({
        message: "Помилка",
        description: `Перевірте чи правильно ви заповнили дані`,
      });
      return;
    }

    const waypoints = selectedRoute.map((placeId) => ({
      location: { placeId },
      stopover: true,
    }));

    routeRef.current.route(
      {
        origin: { placeId: startPlaceId },
        destination: { placeId: startPlaceId },
        waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.WALKING,
      },
      (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          const optimizedOrder = result.routes[0].waypoint_order;

          setOrderedPlacesId([...optimizedOrder.map((index: number) => selectedRoute[index])]);
        } else {
          notification.info({
            message: "Помилка",
            description: `${status}`,
          });
        }
      }
    );
  };

  const geocodeAddress = (
    geocoder: google.maps.Geocoder,
    address: string
  ): Promise<string | null> => {
    return new Promise((resolve) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          resolve(results[0].place_id);
        } else {
          resolve(null);
        }
      });
    });
  };

  return (
    <>
      <div className="absolute right-10 top-10 " style={{ zIndex: 4 }}>
        <Card size="small">
          <p>Вибрано: {selectedPlacesId.length}</p>
        </Card>
      </div>
      <div className="absolute left-0 right-0 flex justify-center bottom-8" style={{ zIndex: 4 }}>
        <Button
          type="primary"
          shape="round"
          icon={<SaveOutlined />}
          disabled={selectedPlacesId.length == 0}
          style={{ width: 200, height: 50, fontSize: 20 }}
          onClick={() => handleShowModal(true)}
        >
          Створити
        </Button>
        <Spin spinning={addRouteMutation.isPending}>
          <Modal
            title="Створити новий маршрут"
            open={isModalOpen}
            onOk={handleGetRoutes}
            onCancel={() => handleShowModal(false)}
            centered
            width={600}
          >
            <Form
              form={form}
              layout="horizontal"
              className="my-8 px-6"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 14 }}
              initialValues={{
                key: "",
                places: [],
              }}
            >
              <Form.Item
                label="Назва маршруту"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Макс. кількість символів: 30",
                    max: 30,
                  },
                ]}
              >
                <Input placeholder="Введіть назву" />
              </Form.Item>
              <Form.Item
                label="Точка старту"
                rules={[
                  {
                    required: true,
                    message: "Введіть правильно адресу",
                    min: 1,
                  },
                ]}
              >
                <Input
                  ref={inputRef}
                  placeholder="Введіть адресу"
                  value={startAddress}
                  onChange={(e) => {
                    setStartAddress(e.target.value);
                    setIsAddressSelected(false);
                  }}
                />
              </Form.Item>
              <Form.Item name="places_id_set" hidden>
                <Input />
              </Form.Item>
              <Form.Item name="img_url" hidden>
                <Input />
              </Form.Item>
            </Form>
          </Modal>
        </Spin>
      </div>
      <div id="map" className="h-full"></div>
    </>
  );
}

export default CreateRoutePage;
