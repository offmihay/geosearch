import { useParams } from "react-router-dom";
import { useCurrPlaceQuery } from "../queries/queries";
import { Button } from "antd";
import { PlaceSearch } from "../types/typePlaceSearch";

const RouteInfoPage = () => {
  const { id } = useParams();

  const currPlaceQuery = useCurrPlaceQuery(id);
  const placeCurr = currPlaceQuery.data?.place;

  const formUrl = (params: { [key: string]: any }) => {
    const url = new URL(
      "https://docs.google.com/forms/d/e/1FAIpQLSfkDsu7_UML3muXMvyrq2L9x4gAXUnshyA3SSqNFcH5vLIRug/viewform?usp=pp_url"
    );
    Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
    return url.toString();
  };

  const params = (place: PlaceSearch) => {
    return {
      "entry.310662946": place?.national_phone_number,
      "entry.1664904206": place?.national_phone_number,
      "entry.628660627": place?.display_name,
      "entry.761657856": place?.formatted_address,
    };
  };

  return (
    <>
      <div className="flex gap-4 flex-col m-4">
        {!!placeCurr && (
          <Button href={formUrl(params(placeCurr))} target="_blank" className="w-[300px] h-[60px]">
            Гугл форма
          </Button>
        )}
        <Button
          type="primary"
          href={placeCurr?.google_maps_URI || ""}
          className="w-[300px] h-[60px]"
        >
          Гугл карти
        </Button>
      </div>
    </>
  );
};

export default RouteInfoPage;
