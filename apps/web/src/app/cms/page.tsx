import CMSDashboard from "./dashboard"
import { requireAdmin } from '@/lib/admin'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function CMSPage() {
  const auth = await requireAdmin()
  if (auth.response) redirect('/login?error=admin-required')
  return <CMSDashboard />
}
