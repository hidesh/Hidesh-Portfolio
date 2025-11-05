import { Metadata } from 'next'
import { MessagesClient } from './messages-client'

export const metadata: Metadata = {
  title: 'Contact Messages | CMS',
  description: 'Manage contact form submissions',
}

export default function MessagesPage() {
  return <MessagesClient />
}
