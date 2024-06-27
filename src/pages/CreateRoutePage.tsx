import { Button, Card, Form, Input, Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import { SaveOutlined } from "@ant-design/icons";

function CreateRoutePage() {
  const mapRef = useRef<google.maps.Map>();
  const [places, setPlaces] = useState<any[]>([]);
  const [selectedPlacesId, setSelectedPlacesId] = useState<string[]>([]);
  const [form] = Form.useForm();

  const [isMapLoaded, seIsMapLoaded] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleClickMarker = (id: string, marker: any, pinDefault: any, pinSelected: any) => {
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
    fetch("/placesTest.json")
      .then((response) => response.json())
      .then((data) => setPlaces(data))
      .catch((error) => console.error("Error fetching places:", error));
    handleCreateMap();
  }, []);

  useEffect(() => {
    isMapLoaded && handleSetMarkers();
  }, [isMapLoaded]);

  const handleFormSubmit = async () => {
    try {
      form.setFieldsValue({ places: selectedPlacesId });
      const values = await form.validateFields();
      console.log(values);
    } catch (error) {
      console.log(error);
    }
  };

  const isFinished = (place: any) => {
    return place.routeStatus !== "TO_DO";
  };

  const handleSetMarkers = async () => {
    const map = mapRef.current!;
    const bounds = new google.maps.LatLngBounds();

    const { AdvancedMarkerElement } = (await google.maps.importLibrary(
      "marker"
    )) as google.maps.MarkerLibrary;

    // Loop through and set all the markers
    places.forEach((place) => {
      const pinDone = new google.maps.marker.PinElement({
        scale: 1.25,
        background: "#DCDCDC",
        borderColor: "#A9A9A9",
        glyphColor: "#A9A9A9",
      });

      const pinDefault = new google.maps.marker.PinElement({
        scale: 1.25,
        background: "#87CEFA",
        borderColor: "#4169E1",
        glyphColor: "#4169E1",
      });

      const pinSelected = new google.maps.marker.PinElement({
        scale: 1.25,
        background: "#2DEC59",
        borderColor: "#2FC351",
        glyphColor: "#2FC351",
      });

      const markerOptions = {
        map,
        position: place.location,
        title: place.id,
        gmpClickable: !isFinished(place),
        content: isFinished(place) ? pinDone.element : pinDefault.element,
      };

      const markerView = new AdvancedMarkerElement(markerOptions);

      if (!isFinished(place)) {
        markerView.addListener("click", () => {
          handleClickMarker(place.id, markerView, pinDefault, pinSelected);
        });
      }

      bounds.extend(place.location as google.maps.LatLng);
    });

    map.fitBounds(bounds);
  };

  const handleCreateMap = async () => {
    const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;

    const center = new google.maps.LatLng(50.38637, 30.46218);

    mapRef.current = new Map(document.getElementById("map")!, {
      center: center,
      zoom: 11,
      mapId: "d4f8bd35a29bd93f",
      disableDefaultUI: true,
      clickableIcons: false,
    });

    mapRef.current.addListener("tilesloaded", function () {
      seIsMapLoaded(true);
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
          onClick={showModal}
        >
          Готово
        </Button>
        <Modal
          open={isModalOpen}
          onOk={handleFormSubmit}
          onCancel={handleCancel}
          centered
          width={600}
        >
          <Form
            form={form}
            layout="horizontal"
            className="my-8 px-6"
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
                  message: "",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="places" hidden>
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <div id="map" className="h-full"></div>
    </>
  );
}

export default CreateRoutePage;
