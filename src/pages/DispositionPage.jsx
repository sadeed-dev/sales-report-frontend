import DispositionReport from '../components/reports/DispositionReport'

export default function DispositionPage() {
  return (
    <main className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Agent Wise Disposition</h1>
        <p className="text-slate-500 mt-2">Call disposition breakdown by agent.</p>
      </div>
      <div className="animate-fade-in">
        <DispositionReport />
      </div>
    </main>
  )
}
