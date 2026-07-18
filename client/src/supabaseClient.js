import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase config. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in client/.env (see .env.example).'
  );
}

// createClient() throws synchronously on an invalid/missing URL, which would
// crash the whole module graph before React ever mounts (a blank white page,
// not even the app's own error screen). Fall back to a syntactically valid
// placeholder so the app can still boot and report the real error through
// the normal loadTeams() failure path instead.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
