// Tata Call Logs Report Data
export const tataCallLogsData = [
  {
    id: 1,
    salesman: 'RAJESH KUMAR',
    mobile: '9876543210',
    branch: 'Tata Delhi',
    totalCalls: 342,
    connected: 128,
    notConnected: 214,
    totalTalkTime: '02:15:34',
    avgTalkTime: '00:00:23',
    talktimePercent: '28.4%',
  },
  {
    id: 2,
    salesman: 'PRIYA SHARMA',
    mobile: '9876543211',
    branch: 'Tata Mumbai',
    totalCalls: 298,
    connected: 112,
    notConnected: 186,
    totalTalkTime: '01:58:22',
    avgTalkTime: '00:00:24',
    talktimePercent: '26.1%',
  },
  {
    id: 3,
    salesman: 'AMIT SINGH',
    mobile: '9876543212',
    branch: 'Tata Bangalore',
    totalCalls: 276,
    connected: 95,
    notConnected: 181,
    totalTalkTime: '01:42:15',
    avgTalkTime: '00:00:22',
    talktimePercent: '24.3%',
  },
]

// VI Call Logs Report Data
export const viCallLogsData = [
  {
    id: 1,
    salesman: 'KULDEEP SHARMA',
    mobile: '7230059654',
    branch: 'Jaipur Galaxy',
    totalCalls: 287,
    connected: 95,
    notConnected: 192,
    totalTalkTime: '01:25:48',
    avgTalkTime: '00:00:17',
    talktimePercent: '18.6%',
  },
  {
    id: 2,
    salesman: 'NITESH UPADHAYA',
    mobile: '7230059674',
    branch: 'Jaipur Galaxy',
    totalCalls: 240,
    connected: 110,
    notConnected: 130,
    totalTalkTime: '01:42:56',
    avgTalkTime: '00:00:25',
    talktimePercent: '21.5%',
  },
  {
    id: 3,
    salesman: 'HEMANT KUMAR BAIRWA',
    mobile: '7230010871',
    branch: 'Jaipur Galaxy',
    totalCalls: 228,
    connected: 79,
    notConnected: 149,
    totalTalkTime: '01:03:50',
    avgTalkTime: '00:00:16',
    talktimePercent: '13.2%',
  },
]

// Combined Call Logs Data (VI + Tata)
export const combinedCallLogsData = [
  ...viCallLogsData.map((item, idx) => ({ ...item, id: idx + 1 })),
  ...tataCallLogsData.map((item, idx) => ({ ...item, id: viCallLogsData.length + idx + 1 })),
]

// Agent Wise Disposition Data
export const dispositionData = [
  {
    id: 1,
    salesman: 'KULDEEP SHARMA',
    mobile: '7230059654',
    interested: 45,
    notInterested: 120,
    callbackRequired: 78,
    callFailed: 34,
    noResponse: 10,
  },
  {
    id: 2,
    salesman: 'NITESH UPADHAYA',
    mobile: '7230059674',
    interested: 52,
    notInterested: 98,
    callbackRequired: 65,
    callFailed: 22,
    noResponse: 3,
  },
  {
    id: 3,
    salesman: 'HEMANT KUMAR BAIRWA',
    mobile: '7230010871',
    interested: 38,
    notInterested: 110,
    callbackRequired: 58,
    callFailed: 18,
    noResponse: 4,
  },
  {
    id: 4,
    salesman: 'JITENDRA KUMAR MEENA',
    mobile: '8058649107',
    interested: 42,
    notInterested: 105,
    callbackRequired: 52,
    callFailed: 16,
    noResponse: 5,
  },
]

export const agentData: Agent[] = [
  {
    id: 1,
    name: 'KULDEEP SHARMA',
    mobile: '7230059654',
    branch: 'Jaipur Galaxy',
    totalCalls: 287,
    connected: 95,
    notConnected: 192,
    talkTime: '01:25:48',
    avgTalkTime: '00:00:17',
  },
  {
    id: 2,
    name: 'NITESH UPADHAYA',
    mobile: '7230059674',
    branch: 'Jaipur Galaxy',
    totalCalls: 240,
    connected: 110,
    notConnected: 130,
    talkTime: '01:42:56',
    avgTalkTime: '00:00:25',
  },
  {
    id: 3,
    name: 'HEMANT KUMAR BAIRWA 2',
    mobile: '7230010871',
    branch: 'Jaipur Galaxy',
    totalCalls: 228,
    connected: 79,
    notConnected: 149,
    talkTime: '01:03:50',
    avgTalkTime: '00:00:16',
  },
  {
    id: 4,
    name: 'JITENDRA KUMAR MEENA',
    mobile: '8058649107',
    branch: 'Jaipur Galaxy',
    totalCalls: 220,
    connected: 75,
    notConnected: 145,
    talkTime: '01:11:27',
    avgTalkTime: '00:00:19',
  },
  {
    id: 5,
    name: 'AYUSH',
    mobile: '7891019925',
    branch: 'Jaipur Galaxy',
    totalCalls: 219,
    connected: 93,
    notConnected: 126,
    talkTime: '01:10:43',
    avgTalkTime: '00:00:19',
  },
  {
    id: 6,
    name: 'NITESH KUMAWAT',
    mobile: '9887812369',
    branch: 'Jaipur Galaxy',
    totalCalls: 187,
    connected: 80,
    notConnected: 107,
    talkTime: '00:53:20',
    avgTalkTime: '00:00:17',
  },
  {
    id: 7,
    name: 'RENU KANWAR SHEKHAWAT',
    mobile: '7230059659',
    branch: 'Jaipur Signature',
    totalCalls: 134,
    connected: 58,
    notConnected: 76,
    talkTime: '01:14:30',
    avgTalkTime: '00:00:33',
  },
  {
    id: 8,
    name: 'MOHD SHIFWAN QURESHI',
    mobile: '7412036947',
    branch: 'Jaipur Galaxy',
    totalCalls: 74,
    connected: 34,
    notConnected: 40,
    talkTime: '01:39:42',
    avgTalkTime: '00:01:20',
  },
  {
    id: 9,
    name: 'SHIVANI SAHU',
    mobile: '9033161918',
    branch: 'Mojika',
    totalCalls: 64,
    connected: 35,
    notConnected: 29,
    talkTime: '00:32:19',
    avgTalkTime: '00:00:30',
  },
  {
    id: 10,
    name: 'ARVIND KUMAR SWAMI',
    mobile: '9785845391',
    branch: 'Jaipur Galaxy',
    totalCalls: 59,
    connected: 25,
    notConnected: 34,
    talkTime: '00:20:00',
    avgTalkTime: '00:00:24',
  },
]

export const summaryMetrics = {
  totalCalls: 1712,
  connected: 684,
  notConnected: 1028,
  totalTalkTime: '12:14:37',
  avgTalkTime: '00:00:25',
  interestedLeads: 412,
  conversionRate: '24.1%',
}

export const chartDataCalls = agentData.map((agent) => ({
  name: agent.name.split(' ')[0],
  calls: agent.totalCalls,
}))

export const chartDataDisposition = [
  { name: 'Connected', value: 684 },
  { name: 'Not Connected', value: 1028 },
]

export const chartDataTrends = [
  { date: 'Feb 21', calls: 156 },
  { date: 'Feb 22', calls: 182 },
  { date: 'Feb 23', calls: 195 },
  { date: 'Feb 24', calls: 178 },
  { date: 'Feb 25', calls: 201 },
  { date: 'Feb 26', calls: 187 },
  { date: 'Feb 27', calls: 213 },
]

// Teams Performance Data
export const teamsData = [
  {
    id: 1,
    name: 'Jaipur Galaxy',
    members: 7,
    totalCalls: 1350,
    connected: 467,
    conversionRate: 34.6,
    avgHandleTime: '00:00:24',
    performance: 92,
    trend: 'up' as const,
    leads: 245,
    activeAgents: 7,
  },
  {
    id: 2,
    name: 'Jaipur Signature',
    members: 1,
    totalCalls: 134,
    connected: 58,
    conversionRate: 43.3,
    avgHandleTime: '00:00:33',
    performance: 88,
    trend: 'up' as const,
    leads: 32,
    activeAgents: 1,
  },
  {
    id: 3,
    name: 'Mojika',
    members: 1,
    totalCalls: 64,
    connected: 35,
    conversionRate: 54.7,
    avgHandleTime: '00:00:30',
    performance: 95,
    trend: 'up' as const,
    leads: 10,
    activeAgents: 1,
  },
]

// Analytics & Reporting Data
export const analyticsMetrics = {
  totalCallsToday: 1712,
  interestedLeads: 287,
  conversionRate: 16.8,
  avgCallDuration: '00:00:22',
  peakHour: '14:00 - 15:00',
  abandonmentRate: 65.9,
}

export const dailyCallData = [
  { date: 'Feb 21', calls: 156, connected: 54, leads: 28 },
  { date: 'Feb 22', calls: 189, connected: 65, leads: 35 },
  { date: 'Feb 23', calls: 201, connected: 72, leads: 42 },
  { date: 'Feb 24', calls: 234, connected: 81, leads: 48 },
  { date: 'Feb 25', calls: 267, connected: 94, leads: 58 },
  { date: 'Feb 26', calls: 298, connected: 108, leads: 68 },
  { date: 'Feb 27', calls: 1712, connected: 584, leads: 287 },
]

export const dispositionAnalytics = [
  { name: 'Interested', value: 287, percentage: 16.8 },
  { name: 'Not Interested', value: 812, percentage: 47.4 },
  { name: 'Callback Required', value: 456, percentage: 26.6 },
  { name: 'Call Failed', value: 157, percentage: 9.2 },
]

export const conversionFunnelData = [
  { stage: 'Total Calls', value: 1712, percentage: 100 },
  { stage: 'Connected', value: 584, percentage: 34.1 },
  { stage: 'Interested', value: 287, percentage: 16.8 },
  { stage: 'Qualified Lead', value: 156, percentage: 9.1 },
  { stage: 'Converted', value: 89, percentage: 5.2 },
]

export const callDistributionByBranch = [
  { name: 'Jaipur Galaxy', value: 1350, percentage: 78.9 },
  { name: 'Jaipur Signature', value: 134, percentage: 7.8 },
  { name: 'Mojika', value: 64, percentage: 3.7 },
  { name: 'Others', value: 164, percentage: 9.6 },
]

export const hourlyTrendData = [
  { hour: '08:00', calls: 45, connected: 12 },
  { hour: '09:00', calls: 78, connected: 28 },
  { hour: '10:00', calls: 95, connected: 35 },
  { hour: '11:00', calls: 112, connected: 42 },
  { hour: '12:00', calls: 128, connected: 48 },
  { hour: '13:00', calls: 98, connected: 38 },
  { hour: '14:00', calls: 156, connected: 58 },
  { hour: '15:00', calls: 167, connected: 62 },
  { hour: '16:00', calls: 145, connected: 51 },
  { hour: '17:00', calls: 123, connected: 44 },
  { hour: '18:00', calls: 89, connected: 32 },
  { hour: '19:00', calls: 56, connected: 18 },
]
