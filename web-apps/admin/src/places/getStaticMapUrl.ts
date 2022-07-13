export const GOOGLE_MAPS_STATIC_API_KEY = 'AIzaSyCtuJlhkoash5SoV5k2VZsmV7e3LXL4UOw';

type LatLng = {
  lat: number;
  lng: number;
};

type Marker = {
  location: LatLng;
  label?: string;
};

type Size = {
  width: number;
  height: number;
};

type StaticMapImageOptions = {
  markCenter: boolean;
  size: Size; 
  zoom: number; 
  markers: Array<Marker> 
};

const defaultOptions: StaticMapImageOptions = { 
  markCenter: true,
  size: { width: 400, height: 300 }, 
  zoom: 15,
  markers: []
};

export default function getStaticMapUrl(center: LatLng, options: Partial<StaticMapImageOptions> = {}): string {
  const { markCenter, size, zoom, markers } = Object.assign({}, options, defaultOptions) as StaticMapImageOptions;

  if (markCenter) {
    markers.push({ location: center, label: 'C' });
  }
  
  // https://developers.google.com/maps/documentation/maps-static/start
  const url = [
    `http://maps.googleapis.com/maps/api/staticmap?key=${GOOGLE_MAPS_STATIC_API_KEY}`,
    `center=${center.lat},${center.lng}`,
    `size=${size.width}x${size.height}`,
    `zoom=${zoom}`
  ];

  if (markers && markers.length > 0) {
    url.push(markers.map(m => `markers=label:${m.label}%7C${m.location.lat},${m.location.lng}`).join('&'));
  }
  
  return url.join('&');
}