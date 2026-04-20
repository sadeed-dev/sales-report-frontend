import { TrendingUp, TrendingDown } from 'lucide-react'

interface ModernMetricCardProps {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  gradient?: string
  onClick?: () => void
}

export function ModernMetricCard({
  label,
  value,
  change,
  changeLabel,
  icon,
  gradient = 'from-blue-50 to-cyan-50',
  onClick,
}: ModernMetricCardProps) {
  const isPositive = change && change >= 0

  return (
    <div
      onClick={onClick}
      className={`metric-card cursor-pointer group relative overflow-hidden bg-gradient-to-br ${gradient}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-700 transition-all duration-300">{value}</p>

          {change !== undefined && (
            <div className="flex items-center gap-1 mt-3">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-rose-600" />
              )}
              <span className={`text-sm font-semibold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isPositive ? '+' : ''}{change}%
              </span>
              {changeLabel && <span className="text-xs text-slate-500 ml-1">{changeLabel}</span>}
            </div>
          )}
        </div>

        {icon && <div className="text-4xl opacity-10 group-hover:opacity-20 transition-opacity">{icon}</div>}
      </div>
    </div>
  )
}
