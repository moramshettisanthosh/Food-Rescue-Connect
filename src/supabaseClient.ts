import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Helper to check if credentials have been provided by the user
export const isSupabaseConfigured = true; // Set to true as we are providing active defaults

export const supabase = createClient(
  supabaseUrl || 'https://jrrvegzsmswfswhcvcps.supabase.co', 
  supabaseAnonKey || 'sb_publishable_bRLAZYU67L4lgBG_Wv4OpA_F11W10nf'
);
