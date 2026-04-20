'use client'

import { chartDataCalls, chartDataDisposition, chartDataTrends } from '@/lib/data'
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

export function ChartsSection() {
  const colors = ['#f97316', '#10b981']

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      {/* Bar Chart - Calls per Agent */}
      <div className="chart-container">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Calls per Agent</h3>
        <div className="overflow-x-auto -mx-6 px-6">
          <ResponsiveContainer width="100%" height={300} minWidth={300}>
            <BarChart data={chartDataCalls}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="calls" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart - Connection Status */}
      <div className="chart-container">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Connection Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={chartDataDisposition} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} fill="#8884d8" dataKey="value">
              {chartDataDisposition.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#fff' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart - Daily Trends */}
      <div className="chart-container lg:col-span-2">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Daily Trends</h3>
        <div className="overflow-x-auto -mx-6 px-6">
          <ResponsiveContainer width="100%" height={300} minWidth={300}>
            <LineChart data={chartDataTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#fff' }} />
              <Legend wrapperStyle={{ color: '#64748b' }} />
              <Line type="monotone" dataKey="calls" stroke="#0ea5e9" strokeWidth={3} dot={{ fill: '#0ea5e9', r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
