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
