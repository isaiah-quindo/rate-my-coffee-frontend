import { Post } from "./post";

export type ShopStatus =
  | 'active'
  | 'temporarily_closed'
  | 'permanently_closed'
  | 'draft'
  | 'pending_verification';

export type PriceTier = '₱' | '₱₱' | '₱₱₱';

export interface CoffeeShop {
  id: number;

  // Identity
  name: string;
  slug: string | null;
  description: string | null;
  status: ShopStatus;

  // Address (PH context)
  country_code: string; // ISO 3166-1 alpha-2
  region: string | null;
  province: string | null;
  city_municipality: string | null;
  barangay: string | null;
  street_address: string | null;
  postcode: string | null;

  // Coordinates
  latitude: number | null;
  longitude: number | null;

  // Contact & presence
  phone: string | null;
  email: string | null;
  website_url: string | null;
  facebook_url: string | null;
  instagram_handle: string | null;
  google_maps_url: string | null;

  // Commercial hints
  price: PriceTier | null;
  accepts_gcash: boolean;
  accepts_cards: boolean;

  // Amenities
  has_wifi: boolean;
  has_outlets: boolean;
  outdoor_seating: boolean;
  parking_available: boolean;
  wheelchair_accessible: boolean;
  pet_friendly: boolean;
  vegan_options: boolean;
  manual_brew: boolean;
  decaf_available: boolean;

  tags: string[];

  // Claiming
  claimed_by_user_id: number | null;
  claiming_notes: string | null;

  // Ratings cache
  rating_overall_cache: number | null;
  rating_count_cache: number | null;

  // Timestamps (ISO-8601 strings from API)
  created_at: string;
  updated_at: string;

  photos: { url: string; post_id: number | null }[];
  cover_photo: { url: string } | null;
  posts: Post[];
  posts_total: number;
  hours: any[]
}


export interface ShopHour {
  shop_id: number;
  day_of_week: number; // 0=Sun … 6=Sat
  open_time: string | null; // e.g., "08:00:00"
  close_time: string | null; // e.g., "17:00:00"
  is_24h: boolean;
  notes: string | null;
}


