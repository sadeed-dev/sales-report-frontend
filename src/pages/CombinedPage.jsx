import CombinedCallLogsReport from '../components/reports/CombinedCallLogsReport'

export default function CombinedPage() {
  return (
    <main className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Combined Call Logs</h1>
        <p className="text-slate-500 mt-2">Combined call summary from all providers.</p>
      </div>
      <div className="animate-fade-in">
        <CombinedCallLogsReport />
      </div>
    </main>
  )
}
