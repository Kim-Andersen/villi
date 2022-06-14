import { useEffect, useState } from 'react';
import { Place, PlaceId } from '../shared/types';
import placesService from './placesService';

type SetPlaceUpdateFunction = (state: Place) => void;

export default function useEditPlace(placeId: PlaceId): [Place | null, SetPlaceUpdateFunction, boolean, Error | null] {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [placeUpdate, setPlaceUpdate] = useState<Place | null>(null);
  
  useEffect(() => {
    placesService.getPlaceById(placeId)
      .then(place => {
        if (place) {
          setPlaceUpdate(place);
        } else {
          setError(new Error(`Place ${placeId} not found.`));
        }
      })
      .finally(() => setLoading(false));
  }, [placeId]);

  return [placeUpdate, setPlaceUpdate, loading, error];
}