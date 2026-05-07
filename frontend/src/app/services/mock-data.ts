import { User, LostItem, FoundItem, Claim, Notification, Category, DashboardStats, ActivityLog } from '../models/interfaces';

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, category_name: 'Electronics' },
  { id: 2, category_name: 'Books & Notes' },
  { id: 3, category_name: 'Clothing' },
  { id: 4, category_name: 'Accessories' },
  { id: 5, category_name: 'ID & Cards' },
  { id: 6, category_name: 'Keys' },
  { id: 7, category_name: 'Bags & Wallets' },
  { id: 8, category_name: 'Sports Equipment' },
  { id: 9, category_name: 'Stationery' },
  { id: 10, category_name: 'Others' }
];

export const MOCK_USERS: User[] = [
  { id: 1, full_name: 'Admin User', email: 'admin@campus.edu', role: 'admin', course: 'IT Administration', year_level: 'Staff', contact_number: '09171234567' },
  { id: 2, full_name: 'Maria Santos', email: 'maria.santos@campus.edu', role: 'user', course: 'BS Computer Science', year_level: '3rd Year', contact_number: '09181234567' },
  { id: 3, full_name: 'Juan Dela Cruz', email: 'juan.delacruz@campus.edu', role: 'user', course: 'BS Information Technology', year_level: '2nd Year', contact_number: '09191234567' },
  { id: 4, full_name: 'Ana Reyes', email: 'ana.reyes@campus.edu', role: 'user', course: 'BS Engineering', year_level: '4th Year', contact_number: '09201234567' },
  { id: 5, full_name: 'Carlos Garcia', email: 'carlos.garcia@campus.edu', role: 'user', course: 'BS Business Admin', year_level: '1st Year', contact_number: '09211234567' }
];

export const MOCK_LOST_ITEMS: LostItem[] = [
  { id: 1, user_id: 2, category_id: 1, item_name: 'iPhone 14 Pro', description: 'Black iPhone 14 Pro with cracked screen protector, has a blue case', location_lost: 'Library 2nd Floor', date_lost: '2024-03-15', status: 'pending', created_at: '2024-03-15T10:00:00Z', reporter_name: 'Maria Santos', category_name: 'Electronics' },
  { id: 2, user_id: 3, category_id: 2, item_name: 'Calculus Textbook', description: 'Stewart Calculus 8th Edition with highlighted pages', location_lost: 'Room 301 Engineering Bldg', date_lost: '2024-03-14', status: 'pending', created_at: '2024-03-14T09:00:00Z', reporter_name: 'Juan Dela Cruz', category_name: 'Books & Notes' },
  { id: 3, user_id: 4, category_id: 5, item_name: 'Student ID Card', description: 'University ID card with lanyard, name: Ana Reyes', location_lost: 'Cafeteria', date_lost: '2024-03-16', status: 'matched', created_at: '2024-03-16T12:00:00Z', reporter_name: 'Ana Reyes', category_name: 'ID & Cards' },
  { id: 4, user_id: 5, category_id: 7, item_name: 'Black Leather Wallet', description: 'Contains some cards and cash, has initials C.G.', location_lost: 'Parking Lot B', date_lost: '2024-03-13', status: 'pending', created_at: '2024-03-13T14:00:00Z', reporter_name: 'Carlos Garcia', category_name: 'Bags & Wallets' },
  { id: 5, user_id: 2, category_id: 4, item_name: 'Silver Wristwatch', description: 'Casio silver digital watch with metal band', location_lost: 'Gymnasium', date_lost: '2024-03-12', status: 'claimed', created_at: '2024-03-12T08:00:00Z', reporter_name: 'Maria Santos', category_name: 'Accessories' }
];

export const MOCK_FOUND_ITEMS: FoundItem[] = [
  { id: 1, user_id: 3, category_id: 1, item_name: 'Samsung Galaxy Earbuds', description: 'White Samsung earbuds in charging case, found near bench', location_found: 'Student Park', date_found: '2024-03-15', status: 'pending', created_at: '2024-03-15T11:00:00Z', finder_name: 'Juan Dela Cruz', category_name: 'Electronics' },
  { id: 2, user_id: 4, category_id: 6, item_name: 'Car Keys with Keychain', description: 'Toyota car keys with a red heart keychain', location_found: 'Main Gate Entrance', date_found: '2024-03-14', status: 'pending', created_at: '2024-03-14T15:00:00Z', finder_name: 'Ana Reyes', category_name: 'Keys' },
  { id: 3, user_id: 2, category_id: 5, item_name: 'Student ID Card', description: 'University ID found on floor, name starts with A', location_found: 'Cafeteria', date_found: '2024-03-16', status: 'matched', created_at: '2024-03-16T13:00:00Z', finder_name: 'Maria Santos', category_name: 'ID & Cards' },
  { id: 4, user_id: 5, category_id: 3, item_name: 'Blue Jacket', description: 'Nike blue windbreaker jacket, size medium', location_found: 'Auditorium', date_found: '2024-03-11', status: 'pending', created_at: '2024-03-11T16:00:00Z', finder_name: 'Carlos Garcia', category_name: 'Clothing' },
  { id: 5, user_id: 3, category_id: 9, item_name: 'Scientific Calculator', description: 'Casio fx-991ES PLUS, has sticker on back', location_found: 'Room 205 Science Bldg', date_found: '2024-03-10', status: 'claimed', created_at: '2024-03-10T10:00:00Z', finder_name: 'Juan Dela Cruz', category_name: 'Stationery' }
];

export const MOCK_CLAIMS: Claim[] = [
  { id: 1, found_item_id: 3, claimant_id: 4, proof_of_ownership: 'I can describe the ID details: Student number 2021-00456, College of Engineering', claim_status: 'approved', admin_remark: 'Verified with student records', created_at: '2024-03-16T14:00:00Z', item_name: 'Student ID Card', claimant_name: 'Ana Reyes' },
  { id: 2, found_item_id: 5, claimant_id: 2, proof_of_ownership: 'The calculator has my name written inside the battery cover', claim_status: 'approved', admin_remark: 'Confirmed ownership', created_at: '2024-03-11T09:00:00Z', item_name: 'Scientific Calculator', claimant_name: 'Maria Santos' },
  { id: 3, found_item_id: 1, claimant_id: 5, proof_of_ownership: 'I lost my earbuds near the park last week, they are white Samsung buds', claim_status: 'pending', created_at: '2024-03-16T10:00:00Z', item_name: 'Samsung Galaxy Earbuds', claimant_name: 'Carlos Garcia' }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1, user_id: 1, message: 'New claim submitted for "Samsung Galaxy Earbuds" - pending review.', is_read: false, created_at: '2024-03-16T10:00:00Z' },
  { id: 2, user_id: 1, message: 'A possible match has been found: Student ID Card.', is_read: false, created_at: '2024-03-16T13:00:00Z' },
  { id: 3, user_id: 1, message: 'User Maria Santos reported a new lost item: iPhone 14 Pro.', is_read: true, created_at: '2024-03-15T10:00:00Z' },
  { id: 4, user_id: 1, message: 'Claim #1 for Student ID Card has been approved.', is_read: true, created_at: '2024-03-16T15:00:00Z' },
  { id: 5, user_id: 1, message: 'New user registered: Carlos Garcia.', is_read: true, created_at: '2024-03-13T08:00:00Z' }
];

export const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
  { id: 1, user_id: 1, activity: 'Admin approved claim #1 for Student ID Card', full_name: 'Admin User', created_at: '2024-03-16T15:00:00Z' },
  { id: 2, user_id: 1, activity: 'Admin approved claim #2 for Scientific Calculator', full_name: 'Admin User', created_at: '2024-03-11T09:30:00Z' },
  { id: 3, user_id: 2, activity: 'Reported lost item: iPhone 14 Pro', full_name: 'Maria Santos', created_at: '2024-03-15T10:00:00Z' },
  { id: 4, user_id: 3, activity: 'Reported found item: Samsung Galaxy Earbuds', full_name: 'Juan Dela Cruz', created_at: '2024-03-15T11:00:00Z' },
  { id: 5, user_id: 4, activity: 'Submitted claim for Student ID Card', full_name: 'Ana Reyes', created_at: '2024-03-16T14:00:00Z' },
  { id: 6, user_id: 5, activity: 'Submitted claim for Samsung Galaxy Earbuds', full_name: 'Carlos Garcia', created_at: '2024-03-16T10:00:00Z' }
];
