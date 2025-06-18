import { createClient } from '@supabase/supabase-js'

// Replace with your actual Supabase project URL and anon/public key
export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_PROJECT_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
)