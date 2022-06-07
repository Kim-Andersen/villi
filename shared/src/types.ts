export type Place = {
  id: number;
  name: string;
  description: string;
  created_at: Date;
  updated_at?: Date;
  point: {
    lat: number;
    lng: number;
  };
  street_name: string;
  street_number: string;
  postal_code: string;
  city: string;
}