import { createBrowserClient } from '@supabase/ssr'

// Define the Supabase client creation function for browser usage.
export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
