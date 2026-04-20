import { QueryProvider } from '@/components/dashboard/providers/QueryProvider'
import './globals.css'

export default function DashboardAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  )
}
