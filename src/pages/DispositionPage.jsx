import DispositionReport from '../components/reports/DispositionReport'

export default function DispositionPage() {
  return (
    <main className="report-page">
      <div className="report-page-heading">
        <p className="report-eyebrow">Reports / Call activity</p>
        <h1 className="text-3xl font-bold text-slate-900">Agent Wise Disposition</h1>
        <p className="text-slate-500 mt-2">Call disposition breakdown by agent.</p>
      </div>
      <div className="animate-fade-in">
        <DispositionReport />
      </div>
    </main>
  )
}
