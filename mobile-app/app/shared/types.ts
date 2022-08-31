export type Post = {
  id: number;
  profile_id: number;
  profile_pic: string;
  full_name: string;
  /**
   * Date as string.
   */
  created_at: string;
  caption: string;
  comment_count: number;
  /**
   * Array of URLs.
   */
  photos: string[];
  tags: string[];
};

export type Comment = {
  id: number;
  post_id: number;
  /**
   * Date as string.
   */
  created_at: string;
  profile_id: number;
  profile_pic: string;
  full_name: string;
  text: string;
};

export type Profile = {
  id: number; 
  full_name: string;
  email: string;
  profile_pic: string;
};

export type Location = {
  id: number;
  type: 'outlet';
  description: string;
  city: string;
  postal_code: string;
  street: string;
  street_number: string;
  location: [number, number];
};

export type Vendor = {
  id: number;
  name: string;
  description: string;
  email: string;
  phone: number;
  website_url: string;
  tags: string[];
  photos: string[],
  locations: Location[];
};