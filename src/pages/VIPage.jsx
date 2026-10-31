import VICallLogsReport from '../components/reports/VICallLogsReport'

export default function VIPage() {
  return (
    <main className="report-page">
      <div className="report-page-heading">
        <p className="report-eyebrow">Reports / Call activity</p>
        <h1 className="text-3xl font-bold text-slate-900">VI Call Logs</h1>
        <p className="text-slate-500 mt-2">Salesman-wise call summary from VI.</p>
      </div>
      <div className="animate-fade-in">
        <VICallLogsReport />
      </div>
    </main>
  )
}
