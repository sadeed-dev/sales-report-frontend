import TataCallLogsReport from '../components/reports/TataCallLogsReport'
import VICallLogsReport from '../components/reports/VICallLogsReport'
import CombinedCallLogsReport from '../components/reports/CombinedCallLogsReport'
import DispositionReport from '../components/reports/DispositionReport'

export default function ReportsPage({ activeReport = 'tata' }) {
  const reportTitles = {
    tata: { title: 'Tata Call Logs', description: 'Salesman-wise call summary from Tata.' },
    vi: { title: 'VI Call Logs', description: 'Salesman-wise call summary from VI.' },
    combined: { title: 'Combined Call Logs', description: 'Combined call summary from all providers.' },
    disposition: { title: 'Agent Wise Disposition', description: 'Call disposition breakdown by agent.' },
  }

  // const currentTitle = reportTitles[activeReport] || reportTitles.tata

  return (
    <main className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        {/* <h1 className="text-3xl font-bold text-slate-900">{currentTitle.title}</h1>
        <p className="text-slate-500 mt-2">{currentTitle.description}</p> */}
      </div>

      {/* Report Content */}
      <div className="animate-fade-in">
        {activeReport === 'tata' && <TataCallLogsReport />}
        {activeReport === 'vi' && <VICallLogsReport />}
        {activeReport === 'combined' && <CombinedCallLogsReport />}
        {activeReport === 'disposition' && <DispositionReport />}
      </div>
    </main>
  )
}
