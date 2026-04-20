import TataCallLogsReport from '../components/reports/TataCallLogsReport'

export default function TataPage() {
  return (
    <main className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Tata Call Logs</h1>
        <p className="text-slate-500 mt-2">Salesman-wise call summary from Tata.</p>
      </div>
      <div className="animate-fade-in">
        <TataCallLogsReport />
      </div>
    </main>
  )
}
