# Weather Insights Dashboard

An advanced weather analytics and real-time weather classification application built with Next.js and powered by AI-driven insights. This comprehensive dashboard provides detailed weather analysis, visualizations, and intelligent recommendations based on extensive weather data.

## Features

### Core Functionality

- **Real-Time Live Weather Data**: Search for live weather information from any city worldwide with comprehensive weather metrics
- **Advanced Weather Analytics**: Analyze extensive weather datasets with powerful visualization tools
- **Multi-Chart Data Visualization**: 
  - Temperature trends by season
  - Weather type distribution analysis
  - Humidity and wind speed correlation charts
  - Precipitation patterns by location
- **Key Performance Indicators (KPIs)**: Quick overview of critical metrics including total records, average temperature, max humidity, and average precipitation

### Data Management & Export

- **CSV Export**: Download complete weather datasets for external analysis and reporting
- **Individual Chart Export**: Export each visualization as high-quality PNG images
- **Batch Export**: Download all charts at once for comprehensive documentation
- **Data Filtering**: Advanced filtering capabilities to analyze specific weather patterns and time periods

### AI-Powered Intelligence

- **AI Weather Insights**: Generate intelligent, actionable recommendations based on your weather data using Google's Gemini AI
- **Seasonal Analysis**: Receive tailored insights for each season's weather patterns
- **Resource Allocation Guidance**: Get recommendations for optimizing resources based on location-specific weather conditions
- **Smart Recommendations**: AI-generated suggestions for weather preparedness and climate adaptation strategies

### User Experience

- **Dark Mode Support**: Full light and dark theme support for comfortable viewing
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Interactive Dashboard**: Intuitive navigation with tab-based organization
- **Real-Time Updates**: Live weather data fetching with immediate UI updates
- **Error Handling**: Robust error management with user-friendly error messages

## Getting Started

### Prerequisites

- Node.js 18+ installed
- `GOOGLE_GENERATIVE_AI_API_KEY` environment variable for AI features (optional but required for AI insights)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd weather-insights-dashboard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add:
```
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

### Running the Development Server

```bash
npm run dev
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org) - React framework for production
- **AI/ML**: Google Generative AI (Gemini 2.5 Flash) for intelligent insights
- **Styling**: Tailwind CSS for responsive, utility-first design
- **Charts**: Recharts for interactive data visualizations
- **Icons**: Lucide React for consistent icon system
- **UI Components**: shadcn/ui for accessible, customizable components
- **API Integration**: Weather data integration with real-time fetching capabilities

## Project Structure

```
├── app/
│   ├── api/
│   │   └── ai-insights/          # AI analysis endpoint
│   ├── page.tsx                   # Main dashboard page
│   └── layout.tsx                 # Root layout
├── components/
│   ├── charts/                    # Chart visualizations
│   ├── ai-insights-panel.tsx      # AI analysis panel
│   ├── data-export.tsx            # Export functionality
│   ├── filter-bar.tsx             # Data filtering
│   ├── kpi-cards.tsx              # KPI metrics display
│   ├── live-weather.tsx           # Live weather search
│   └── ui/                        # shadcn UI components
├── lib/
│   └── weather-data.ts            # Data types and utilities
└── hooks/
    └── use-weather.ts             # Weather data fetching hook
```

## Key Components

- **KPI Cards**: Display critical weather metrics at a glance
- **Charts Section**: Interactive visualizations of weather patterns and trends
- **Data Export**: Flexible export options for data and visualizations
- **AI Insights Panel**: AI-powered analysis and recommendations
- **Live Weather**: Real-time weather search and display
- **Filter Bar**: Advanced filtering for dataset analysis

## Learn More

To learn more about the technologies used, take a look at these resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com) - Beautiful, accessible components
- [Recharts](https://recharts.org) - Chart library for React
- [Google Generative AI](https://ai.google.dev) - AI model documentation

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_w8Fc38rzO1v4ZzpLgoQDgSHSgIn2)

## License

This project is open source and available under the MIT License.
