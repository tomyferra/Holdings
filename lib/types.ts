export type Category = 'Efectivo' | 'Banco' | 'Cripto' | 'DolarApp' | 'Broker';

export interface Balance {
  id: string;
  month: string; // ISO format
  category: Category;
  amount: number;
  created_at?: string;
  user_id?: string;
}

export interface Goal {
  id: string;
  target_amount: number;
  target_date: string; // ISO format
  user_id?: string;
}
