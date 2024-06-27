import {
  APILoader,
  PlaceDirectionsButton,
  PlaceOverview,
} from "@googlemaps/extended-component-library/react";

type PlaceInfoSiderProps = {
  id: string;
};

export default function PlaceInfoSider({ id }: PlaceInfoSiderProps) {
  return (
    <div className="container">
      <APILoader apiKey={process.env.REACT_APP_API} solutionChannel="GMP_GCC_placeoverview_v1_xl" />
      <PlaceOverview place={id} google-logo-already-displayed>
        <PlaceDirectionsButton slot="action">Directions</PlaceDirectionsButton>
      </PlaceOverview>
    </div>
  );
}
