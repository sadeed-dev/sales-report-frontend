# VI Call Logs Dashboard

A premium sales team analytics dashboard built with Next.js, React, and Tailwind CSS. Monitor agent performance, call metrics, and conversion rates in real-time.

## Features

- 📊 **Real-time Analytics**: Summary cards displaying key metrics (Total Calls, Connected, Not Connected, Talk Time, etc.)
- 📈 **Interactive Charts**: Bar chart, pie chart, and line chart visualizations using Recharts
- 👥 **Agent Performance Table**: Sortable table with agent data, call metrics, and status indicators
- 🎯 **Advanced Filters**: Date range and branch filtering with responsive UI
- 🎨 **Premium Design**: Dark theme with white cards, smooth animations, and professional styling
- 📱 **Fully Responsive**: Mobile-first design that works seamlessly across all devices
- ⚡ **Clean Architecture**: Modular component structure for easy maintenance and scalability

## Project Structure

```
app/
├── layout.tsx              # Root layout with metadata
├── page.tsx                # Main dashboard page
└── globals.css             # Global styles and design tokens

components/
└── dashboard/
    ├── Sidebar.tsx         # Navigation sidebar with menu items
    ├── Header.tsx          # Top header with search and export
    ├── SummaryCards.tsx    # Key metrics cards
    ├── AgentTable.tsx      # Sortable agent performance table
    ├── Charts.tsx          # Dashboard charts (Bar, Pie, Line)
    ├── Filters.tsx         # Date range and branch filters
    └── DashboardLayout.tsx # Responsive layout wrapper with mobile support

lib/
└── data.ts                 # Mock data and interfaces for the dashboard
```

## Component Overview

### Sidebar
Navigation component with collapsible menu items and theme switcher. Fully responsive with mobile toggle.

### Header
Search bar and export functionality with responsive design. Auto-hides labels on smaller screens.

### SummaryCards
Seven metric cards showing:
- Total Calls
- Connected
- Not Connected
- Total Talk Time
- Average Talk Time
- Interested Leads
- Conversion Rate

### AgentTable
Interactive table with:
- Sortable columns (click header to sort)
- Zebra striping for better readability
- Status badges (green for Connected, red for Not Connected)
- Hover effects and smooth transitions
- Horizontal scrolling on mobile

### Charts
Three responsive charts powered by Recharts:
- **Bar Chart**: Calls per agent
- **Pie Chart**: Connection status distribution
- **Line Chart**: Daily trends over 7 days

### Filters
Advanced filtering with:
- Date range picker
- Branch/location selector
- View button for applying filters

## Technology Stack

- **Framework**: Next.js 16
- **UI Components**: Shadcn/ui, Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Styling**: Tailwind CSS 4.2
- **Language**: TypeScript

## Key Features

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions
- Optimized table scrolling

### Performance
- Optimized re-renders with React
- Efficient data sorting
- Smooth animations and transitions
- Minimal CSS bundle

### Premium Aesthetics
- Dark sidebar with white cards
- Orange accent color for CTAs
- Subtle shadows and hover effects
- Professional typography
- Clean, modern design language

## Customization

### Updating Data
Edit `lib/data.ts` to modify:
- Agent data
- Summary metrics
- Chart data

### Styling
Theme values are in `app/globals.css` using CSS variables and Tailwind design tokens.

### Adding New Features
1. Create new component in `components/dashboard/`
2. Import and use in `app/page.tsx`
3. Follow the existing component patterns for consistency

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- All data is currently mock data in `lib/data.ts`
- Connect to a real API by modifying data fetching in components
- Add authentication as needed for production
- Consider adding real-time updates using WebSockets or Server-Sent Events

## License

MIT
