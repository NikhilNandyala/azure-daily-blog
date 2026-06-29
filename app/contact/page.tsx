import { Metadata } from 'next'
import { ContactForm } from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact | AzureFixes',
  description: 'Got an Azure problem you want covered? Found a bug? Send me a message.',
}

export default function ContactPage() {
  return <ContactForm />
}
