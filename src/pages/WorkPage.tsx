import React, { useRef, useState, useEffect } from "react";
import { Button, Input } from "antd";
import type { InputRef } from "antd";

type Route = {
  id: number;
  key: string;
  places: string[];
};

type PlaceId = string;

function WorkPage() {
  const routeRef = useRef<google.maps.DirectionsService | null>(null);
  const [startAddress, setStartAddress] = useState<string>("");
  const [isAddressSelected, setIsAddressSelected] = useState<boolean>(false);
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
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

    handleLoadAutocomplete();
  }, []);

  const handleGetRoutes = async () => {
    // Fetch waypoints from the JSON file
    const response = await fetch("/routesTest.json");
    const routes: Route[] = await response.json();
    const selectedRoute = routes.find((route) => route.id === 1);

    if (!selectedRoute) {
      console.error("Route with ID 1 not found");
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
      console.error("Unable to geocode start address");
      return;
    }

    const waypoints = selectedRoute.places.map((placeId) => ({
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
          const orderedPlaceIds: PlaceId[] = [
            ...optimizedOrder.map((index: number) => selectedRoute.places[index]),
          ];

          console.log("Ordered Place IDs:", orderedPlaceIds);
        } else {
          console.error(`Помилка: ${status}`);
        }
      }
    );
  };

  const geocodeAddress = (
    geocoder: google.maps.Geocoder,
    address: string
  ): Promise<string | null> => {
    return new Promise((resolve, reject) => {
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
      <Input
        ref={inputRef}
        placeholder="Start Address"
        value={startAddress}
        onChange={(e) => {
          setStartAddress(e.target.value);
          setIsAddressSelected(false);
        }}
      />
      <Button onClick={handleGetRoutes} disabled={!isAddressSelected}>
        Get Routes
      </Button>
    </>
  );
}

export default WorkPage;
