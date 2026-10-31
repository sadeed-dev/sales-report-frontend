import CombinedCallLogsReport from '../components/reports/CombinedCallLogsReport'

export default function CombinedPage() {
  return (
    <main className="report-page">
      <div className="report-page-heading">
        <p className="report-eyebrow">Reports / Call activity</p>
        <h1>Combined Call Logs</h1>
        <p>A clear view of your team's calls, connections, and talk time.</p>
      </div>
      <div className="animate-fade-in">
        <CombinedCallLogsReport />
      </div>
    </main>
  )
}
