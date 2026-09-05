export interface HealthRecord {
  id: string;
  user_id: string;
  record_type: 'prescription' | 'report' | 'xray' | 'scan' | 'other';
  title: string;
  file_url: string;
  doctor_name: string | null;
  hospital_name: string | null;
  record_date: string;
  notes: string | null;
  created_at: string;
}

export interface Banner {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}
