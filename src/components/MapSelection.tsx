import React, { useState } from "react";
import { Button } from "antd";

// Интерфейс для координат
interface Coordinate {
  lat: number;
  lng: number;
}

// Интерфейс для квадрата на карте
interface SquareBounds {
  northeast: Coordinate;
  southwest: Coordinate;
}

function MapSelection({ onSquareSelected }: { onSquareSelected: (bounds: SquareBounds) => void }) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [drawingManager, setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(
    null
  );
  const [selectedBounds, setSelectedBounds] = useState<google.maps.LatLngBounds | null>(null);

  // Инициализация карты и рисование квадрата
  const initializeMap = () => {
    const mapOptions: google.maps.MapOptions = {
      center: { lat: 50.37274, lng: 30.47361 },
      zoom: 13,
    };
    const mapInstance = new window.google.maps.Map(
      document.getElementById("map") as HTMLElement,
      mapOptions
    );

    const managerInstance = new window.google.maps.drawing.DrawingManager({
      drawingMode: window.google.maps.drawing.OverlayType.RECTANGLE,
      drawingControl: true,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [window.google.maps.drawing.OverlayType.RECTANGLE],
      },
    });

    managerInstance.setMap(mapInstance);

    window.google.maps.event.addListener(
      managerInstance,
      "rectanglecomplete",
      function (rectangle: any) {
        setSelectedBounds(rectangle.getBounds());
        setDrawingManager(managerInstance);
        setMap(mapInstance);
      }
    );
  };

  // Обработчик выбора квадрата и его передача в родительский компонент
  const handleSelectSquare = () => {
    if (selectedBounds) {
      const bounds: SquareBounds = {
        northeast: {
          lat: selectedBounds.getNorthEast().lat(),
          lng: selectedBounds.getNorthEast().lng(),
        },
        southwest: {
          lat: selectedBounds.getSouthWest().lat(),
          lng: selectedBounds.getSouthWest().lng(),
        },
      };
      onSquareSelected(bounds);
      if (drawingManager) {
        drawingManager.setMap(null); // Отключаем рисование после выбора
      }
    }
  };

  // Инициализация карты при монтировании компонента
  React.useEffect(() => {
    initializeMap();
  }, []);

  return (
    <>
      <div id="map" style={{ height: "400px", width: "100%" }} />
      <Button onClick={handleSelectSquare}>Выбрать квадрат</Button>
    </>
  );
}

export default MapSelection;
