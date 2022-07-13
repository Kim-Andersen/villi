import React from 'react';
import { Location, LocationInput } from '../../shared';

export default function LocationAddressDisplay({ location }: { location: Location | LocationInput }): React.ReactElement {
  return (
    <address>
      <strong>{location.name}</strong><br/>
      {location.street_name} {location.street_number}<br/>
      {location.postal_code} {location.city}<br/>
    </address>
  );
}