import { createClient } from '@supabase/supabase-js';

let custom = {
  supabaseUrl: '',
  supabaseAnonKey: ''
};

try {
  const settings = JSON.parse(localStorage.getItem('settings'));
  custom.supabaseUrl = settings?.sync?.advanced?.supabaseUrl || '';
  custom.supabaseAnonKey = settings?.sync?.advanced?.supabaseAnonKey || '';
} catch (e) {
  console.error(e)
}

const supabaseUrl = custom.supabaseUrl.length > 0 ? custom.supabaseUrl : import.meta.env.VITE_APP_SUPABASE_URL;
const supabaseAnonKey = custom.supabaseUrl.length > 0 ? custom.supabaseUrl : import.meta.env.VITE_APP_SUPABASE_ANON_KEY;

export default createClient(supabaseUrl, supabaseAnonKey);