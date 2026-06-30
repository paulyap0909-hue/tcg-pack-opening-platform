import { createClient } from '@supabase/supabase-js'

export const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export const getDemoUserId = () => {
  const demoUserId = process.env.DEMO_USER_ID

  if (!demoUserId) {
    throw new Error('Missing DEMO_USER_ID. Replace demo mode with Supabase Auth before production.')
  }

  return demoUserId
}
