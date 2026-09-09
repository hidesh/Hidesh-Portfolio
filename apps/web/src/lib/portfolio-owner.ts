// This portfolio belongs to this verified Supabase email identity.
// Authorization must use auth.getUser(), never form input or user_metadata.
export function isVerifiedPortfolioOwner(user: {
  email?: string
  email_confirmed_at?: string
  is_anonymous?: boolean
}) {
  return (
    !user.is_anonymous &&
    Boolean(user.email_confirmed_at) &&
    user.email?.toLowerCase() === 'hidesh@live.dk'
  )
}
