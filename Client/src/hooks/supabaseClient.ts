import { createClient } from '@supabase/supabase-js'

// Replace with your actual Supabase project URL and anon/public key
export const supabase = createClient(
    'https://ryxipipmkchhdmirludf.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5eGlwaXBta2NoaGRtaXJsdWRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NjkzMDMsImV4cCI6MjA2NTE0NTMwM30.erFEuoyJNsqI8jer2Z0WKIUyFcr4JKSEq7BzvZrfGFk'
)