export type PostStatus = 'draft' | 'published' | 'flagged' | 'removed';

// Known rating keys from schema; allow extra keys as well
export type RatingKey =
  | 'coffee_quality'
  | 'vibe'
  | 'service'
  | 'value'
  | 'wifi'
  | 'noise'
  | 'seating'
  | 'outlets'
  | 'cleanliness'
  | 'food'
  | 'location_convenience'
  | 'consistency';

export type Ratings = Partial<Record<RatingKey | string, number>>;

export type TasteProfile = Record<string, number> | null;

export interface Post {
  id: number;
  shop_id: number;
  author_user_id: number | null;
  is_anonymous: boolean;

  body: string | null;
  ratings: Ratings; // 0.5 – 5.0 (step 0.5)

  visited_at: string | null; // ISO date (YYYY-MM-DD)
  spend_php: number | null;
  ordered_items: string[];

  taste_profile: TasteProfile;

  seat_context: string | null;
  internet_speed_mbps: number | null;

  status: PostStatus;
  flagged_count: number;
  admin_notes: string | null;
  deleted_at: string | null; // ISO timestamp or null

  ip_hash: string | null; // hex/base64 depending on API
  user_agent: string | null;

  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp

  overall_score: number | null; // generated

  // Optional relations when included by API
  photos?: PostPhoto[];
  votes?: PostVote[];
  shop?: {
    id: number;
    name: string;
    slug: string | null;
  };

  total: number;
}

export interface PostPhoto {
  id: number;
  post_id: number;
  url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}

export interface PostVote {
  post_id: number;
  user_id: number;
  is_helpful: boolean;
  created_at: string;
}


