import NodeGeoCoder from 'node-geocoder';
import { envVar } from '../environment';

const options: NodeGeoCoder.Options = {
  apiKey: envVar('GEOCODER_API_KEY'),
  provider: 'locationiq',
  httpAdapter: 'https',
  formatter: null
};

const geocoder = NodeGeoCoder(options);

export async function geocode(query: string): Promise<NodeGeoCoder.Entry[]> {
  return await geocoder.geocode(query);
}