import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Check if user has completed onboarding
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check if user has a business record
        const { data: businesses } = await supabase
          .from('businesses')
          .select('id')
          .eq('user_id', user.id)
          .single()

        // If no business exists, redirect to onboarding
        if (!businesses) {
          return NextResponse.redirect(`${origin}/onboarding`)
        }
      }
      
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with some instructions
  return NextResponse.redirect(`${origin}/sign-in?error=Could not authenticate user`)
}
