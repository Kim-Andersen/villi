import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import React, { useState } from 'react';
import { ZodError } from 'zod';
import getStaticMapUrl from '../../places/getStaticMapUrl';
import { LocationInput, locationInputSchema } from '../../shared';
import LocationIQAutocomplete, { LocationIQ } from '../common/LocationIQAutocomplete';

type Props = {
  country: string;
  onSelect: (location: LocationInput) => void;
};

export default function FindLocation({ country, onSelect }: Props): React.ReactElement {
  const [location, setLocation] = useState<LocationInput | null>(null);
  const [locationParseError, setLocationParseError] = useState<ZodError | null>(null);

  const handlePlaceSelected = (place: LocationIQ.AutocompleteResult) => {
    const { name, road: street_name, house_number: street_number, postcode: postal_code, city, country_code: country } = place.address;
    const parsed = locationInputSchema.safeParse({
      name,
      street_name,
      street_number,
      postal_code,
      city,
      country,
      point: [Number(place.lat), Number(place.lon)]
    });
    if(parsed.success) {
      setLocation(parsed.data);
      onSelect(parsed.data);
      setLocationParseError(null);
    } else {
      console.log(parsed.error);
      setLocationParseError(parsed.error);
    }
  };

  return (
    <React.Fragment>
      <LocationIQAutocomplete onSelect={handlePlaceSelected} country={country} />
      
      {locationParseError && 
        <Alert severity="warning">
          <AlertTitle>Missing location information:</AlertTitle>
          <strong>
           {locationParseError.issues.map(issue => issue.path.join('.').replace('_', ' ')).join(', ')} 
          </strong>
        </Alert>
      }
      
      <Box sx={{ mb: 2 }} style={{ width: '100%', maxHeight: 300, backgroundColor: '#eee' }}>
        {location && 
          <img 
            style={{ width: '100%' }} 
            src={getStaticMapUrl({ lat: location.point[0], lng: location.point[1] }, { size: { width: 500, height: 300 } })} 
            alt=''
            />}
      </Box>
    </React.Fragment>
  );
}