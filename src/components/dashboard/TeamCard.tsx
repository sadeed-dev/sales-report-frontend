import { TrendingUp, Users, Phone, Target } from 'lucide-react'

interface TeamCardProps {
  name: string
  members: number
  totalCalls: number
  connected: number
  conversionRate: number
  performance: number
  trend: 'up' | 'down'
  onClick?: () => void
}

export function TeamCard({
  name,
  members,
  totalCalls,
  connected,
  conversionRate,
  performance,
  trend,
  onClick,
}: TeamCardProps) {
  return (
    <div
      onClick={onClick}
      className="card-premium group cursor-pointer relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500" />

      <div className="relative space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{name}</h3>
            <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
              <Users className="w-4 h-4" />
              {members} member{members !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-600">{performance}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-lg p-3">
            <p className="text-xs text-slate-600 font-medium">Total Calls</p>
            <p className="text-xl font-bold text-blue-900 mt-1">{totalCalls}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/30 rounded-lg p-3">
            <p className="text-xs text-slate-600 font-medium">Connected</p>
            <p className="text-xl font-bold text-emerald-900 mt-1">{connected}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100/30 rounded-lg p-3">
            <p className="text-xs text-slate-600 font-medium">Conversion</p>
            <p className="text-xl font-bold text-orange-900 mt-1">{conversionRate}%</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/30 rounded-lg p-3">
            <p className="text-xs text-slate-600 font-medium">Avg Handle</p>
            <p className="text-lg font-bold text-purple-900 mt-1">00:00:25</p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Overall Score</span>
            <div className="flex-1 ml-3 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${performance}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
