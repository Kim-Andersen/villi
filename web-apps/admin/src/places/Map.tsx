import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import React from 'react';

export const GOOGLE_MAPS_API_KEY = 'AIzaSyAA_2GU7JHv1BaGCkaXVZ07vRNKs2eBtS8';

type MapProps = {
  center: {
    lat: number;
    lng: number;
  }
};

export default function Map(props: MapProps): React.ReactElement {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  const renderMap = () => {    
    const mapOptions: google.maps.MapOptions = {
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
      controlSize: 24,
      streetViewControl: false,
      fullscreenControl: false
    };
    
    function onLoad (map: google.maps.Map) {
      // Show marker on center position.
      new google.maps.Marker({
        position: props.center,
        map
      });
    }

    return (
      <GoogleMap
        onLoad={onLoad}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        options={mapOptions}
        center={props.center}
        zoom={15}
      >
      </GoogleMap>
    );
  }

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>
  }

  return isLoaded ? renderMap() : <div>Loading...</div>
}
