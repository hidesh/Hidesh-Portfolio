/**
 * Environment Variables Validator
 * Ensures all required environment variables are present and valid
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_CLARITY_PROJECT_ID'
] as const

const optionalEnvVars = [
  'CONTACT_EMAIL',
  'NODE_ENV',
  'SUPABASE_SERVICE_ROLE_KEY',
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
] as const

export function validateEnvironment() {
  const missing: string[] = []
  const invalid: string[] = []

  // Check required variables
  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar]
    
    if (!value) {
      missing.push(envVar)
      continue
    }

    // Validate format
    switch (envVar) {
      case 'NEXT_PUBLIC_SUPABASE_URL':
        if (!value.startsWith('https://') || !value.includes('.supabase.co')) {
          invalid.push(`${envVar} must be a valid Supabase URL`)
        }
        break
      case 'NEXT_PUBLIC_SUPABASE_ANON_KEY':
        if (!value.startsWith('eyJ') || value.length < 100) {
          invalid.push(`${envVar} must be a valid JWT token`)
        }
        break
      case 'NEXT_PUBLIC_CLARITY_PROJECT_ID':
        if (value.length < 5 || value === 'your_clarity_project_id_here') {
          invalid.push(`${envVar} must be a valid Clarity project ID`)
        }
        break
    }
  }

  // Check for placeholder values
  const placeholderValues = [
    'your_supabase_project_url_here',
    'your_supabase_anon_key_here',
    'your_clarity_project_id_here',
    'your_contact_email@example.com'
  ]

  for (const envVar of [...requiredEnvVars, ...optionalEnvVars]) {
    const value = process.env[envVar]
    if (value && placeholderValues.includes(value)) {
      invalid.push(`${envVar} still contains placeholder value`)
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  if (invalid.length > 0) {
    throw new Error(`Invalid environment variables: ${invalid.join(', ')}`)
  }

  console.log('✅ Environment variables validated successfully')
  return true
}

// Auto-validate in non-production builds
if (process.env.NODE_ENV !== 'production') {
  try {
    validateEnvironment()
  } catch (error) {
    console.error('❌ Environment validation failed:', error)
    process.exit(1)
  }
}