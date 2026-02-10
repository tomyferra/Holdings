import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Category = 'Efectivo' | 'Banco' | 'Cripto' | 'DolarApp' | 'Broker';

export interface Balance {
  id: string;
  month: string; // ISO format
  category: Category;
  amount: number;
}

export interface Goal {
  id: string;
  target_amount: number;
  target_date: string; // ISO format
}
