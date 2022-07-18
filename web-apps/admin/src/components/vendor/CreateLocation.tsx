import Button from '@mui/material/Button';
import React, { useState } from 'react';
import { LocationInput } from '../../shared';
import getStaticMapUrl from '../../utils/getStaticMapUrl';
import LocationIQAutocomplete, { LocationIQ } from '../common/LocationIQAutocomplete';

type Props = {
  country: string;
  onSelect: (location: LocationInput) => void;
};

export default function CreateLocation({ country, onSelect }: Props): React.ReactElement {
  const [location, setLocation] = useState<LocationInput | null>(null);

  const handleButtonClick = () => {
    onSelect(location!);
  };

  const handlePlaceSelected = (place: LocationIQ.AutocompleteResult) => {
    const { name, road: street_name, house_number: street_number, postcode: postal_code, city, country_code: country } = place.address;
    setLocation({
      name,
      street_name,
      street_number,
      postal_code,
      city,
      country,
      point: [Number(place.lat), Number(place.lon)]
    });
  };

  return (
    <React.Fragment>
      <LocationIQAutocomplete onSelect={handlePlaceSelected} country={country} />

      <div style={{ width: '100%', maxHeight: 300, backgroundColor: '#eee' }}>
        {location && <img style={{ width: '100%' }} src={getStaticMapUrl({ lat: location.point[0], lng: location.point[1] }, { size: { width: 500, height: 300 } })} />}
      </div>

      <Button disabled={!location} variant='contained' onClick={handleButtonClick}>Continue</Button>
    </React.Fragment>
  );
}