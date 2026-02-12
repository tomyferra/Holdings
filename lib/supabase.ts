import { createClient } from './supabase/client';
export * from './types';

export const supabase = createClient();
