import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// null in local dev without Supabase env: the API's dev-mode user is used instead
export const supabase = url && key ? createClient(url, key, { auth: { flowType: 'pkce' } }) : null;
