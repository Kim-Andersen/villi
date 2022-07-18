
/**
 * AUTO-GENERATED FILE @ Sat, 23 Jul 2022 15:01:19 GMT - DO NOT EDIT!
 *
 * This file was automatically generated by schemats v.1.0.5
 * $ schemats generate postgres://username:password@localhost:5432/villi-dev -t vendor location vendor_location tagged photo entity_photo -s public
 *
 */

import { OpeningHours, LocationTypes, PhotoSizes } from '../types'





export interface Vendor { 
  id: number
  name: string
  created_at: Date
  updated_at?: Date | null
  description?: string | null
  website_url?: string | null
  facebook_url?: string | null
  instagram_url?: string | null
  youtube_url?: string | null 
}

export interface Location { 
  id: number
  created_at: Date
  updated_at?: Date | null
  name: string
  description?: string | null
  street_name: string
  street_number: string
  postal_code: string
  city: string
  country: string
  point: any
  opening_hours?: OpeningHours | null 
}

export interface VendorLocation { 
  id: number
  created_at: Date
  updated_at?: Date | null
  vendor_id: number
  location_id: number
  types: LocationTypes
  note?: string | null
  opening_hours?: OpeningHours | null 
}

export interface Tagged { 
  entity_id: number
  type: string
  tags: string[] 
}

export interface Photo { 
  id: number
  created_at: Date
  bucket: string
  content_type: string
  key: string
  sizes: PhotoSizes 
}

export interface EntityPhoto { 
  id: number
  photo_id: number
  entity_id: number
  entity_type: string 
}

export interface Tables {
  vendor: Vendor,
  location: Location,
  vendor_location: VendorLocation,
  tagged: Tagged,
  photo: Photo,
  entity_photo: EntityPhoto
}

export type CustomTypes = OpeningHours | LocationTypes | PhotoSizes