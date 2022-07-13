export type GooglePlaceAutocompleteResult = {
  place_id: string;
  /**
   * @example "Le Pointu, Rue Neuve, Lausanne, Schweiz"
   */
  description: string; 
  /**
   * @example ["bar", "point_of_interest", "establishment"]
   */
  types: string[];
};

/**
 * https://developers.google.com/maps/documentation/geocoding/requests-geocoding#Types
 */
type AddressComponentType = 'street_address' | 'street_number' | 'route' | 'locality' | 'political' | 'administrative_area_level_1' | 'administrative_area_level_2' | 'country' | 'postal_code' | '';

export type GooglePlaceDetailsResult = {
  place_id: string;
  /**
   * @example "Le Pointu Café-Bar & Brunchs"
   */
  name: string;
  /**
   * @example "Rue Neuve 2, 1003 Lausanne, Switzerland"
   */
  address_components: Array<{ long_name: string; short_name: string; types: AddressComponentType[] }>;
  formatted_address: string;
  geometry: {
    location : {
      lat : number;
      lng : number;
   }
  };
  photos: [
    {
      width: number;
      height : number;
      photo_reference: string;
      html_attributions : string[];
   }
  ];
  opening_hours : {
    open_now : boolean;
    periods : [
       {
          close : {
             day : number;
             time : string;
          },
          open : {
            day : number;
            time : string;
          }
       }
    ];
  };
  price_level : number;
  rating: number;
  reviews: [
    {
      author_name : string;
      author_url : string;
      language : string;
      profile_photo_url : string;
      rating : number;
      relative_time_description : string;
      text : string;
      time : number;
    }
  ];
  /**
   * @example ["bar", "point_of_interest", "establishment"]
   */
  types : string[];
  url: string;
  user_ratings_total: number;
  utc_offset: number;
  vicinity: string;
  website: string;
  /**
   * @example "OPERATIONAL"
   */
  business_status: string;
}