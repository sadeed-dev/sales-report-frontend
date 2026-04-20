import VICallLogsReport from '../components/reports/VICallLogsReport'

export default function VIPage() {
  return (
    <main className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">VI Call Logs</h1>
        <p className="text-slate-500 mt-2">Salesman-wise call summary from VI.</p>
      </div>
      <div className="animate-fade-in">
        <VICallLogsReport />
      </div>
    </main>
  )
}
