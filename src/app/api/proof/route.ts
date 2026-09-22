import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path')
  if (!path) return NextResponse.json({ error: 'no path' }, { status: 400 })

  const supabase = await createClient()
  const { data, error } = await supabase.storage
    .from('proofs')
    .createSignedUrl(path, 60 * 60)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.redirect(data.signedUrl)
}