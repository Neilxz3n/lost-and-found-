export interface User {
  id: number;
  full_name: string;
  email: string;
  role: 'admin' | 'user';
  course?: string;
  year_level?: string;
  contact_number?: string;
  profile_image?: string;
  created_at?: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface LostItem {
  id: number;
  user_id: number;
  category_id: number;
  item_name: string;
  description: string;
  location_lost: string;
  date_lost: string;
  image?: string;
  status: 'pending' | 'matched' | 'claimed';
  created_at: string;
  reporter_name?: string;
  category_name?: string;
}

export interface FoundItem {
  id: number;
  user_id: number;
  category_id: number;
  item_name: string;
  description: string;
  location_found: string;
  date_found: string;
  image?: string;
  status: 'pending' | 'matched' | 'claimed';
  created_at: string;
  finder_name?: string;
  category_name?: string;
}

export interface Claim {
  id: number;
  found_item_id: number;
  claimant_id: number;
  proof_of_ownership: string;
  claim_status: 'pending' | 'approved' | 'rejected';
  admin_remark?: string;
  created_at: string;
  item_name?: string;
  item_image?: string;
  claimant_name?: string;
}

export interface Notification {
  id: number;
  user_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Category {
  id: number;
  category_name: string;
}

export interface DashboardStats {
  total_lost: number;
  total_found: number;
  pending_claims: number;
  approved_claims: number;
  total_users: number;
  user_lost: number;
  user_found: number;
  user_claims: number;
}

export interface ActivityLog {
  id: number;
  user_id: number;
  activity: string;
  full_name: string;
  created_at: string;
}
