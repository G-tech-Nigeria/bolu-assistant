# Bolu Assistant - Personal Command Center

A comprehensive personal productivity and life management application built with React, TypeScript, and Supabase.

## 🚀 Features

### Core Functionality
- **Daily Agenda** - Structured daily routine & time blocks
- **Calendar** - Advanced calendar with Google sync & multiple views
- **Notes** - Quick notes, ideas, and thoughts with folder organization
- **Dev Roadmap** - Track your software engineering progress
- **Finance** - Personal finance tracking and budgeting
- **Plant Care** - Plant care schedule and watering reminders
- **Health & Habits** - Gym streaks, water intake, and habit tracking
- **Job/Career** - Job application tracking and career management
- **Moro Company** - Business area management and goal tracking
- **Portfolio** - Professional links and portfolio showcase

### Technical Features
- **Progressive Web App (PWA)** - Installable with offline support
- **Dark/Light Mode** - Automatic theme switching
- **Real-time Sync** - Live updates across all devices
- **Responsive Design** - Works on desktop, tablet, and mobile
- **TypeScript** - Type-safe development
- **Supabase Backend** - PostgreSQL database with real-time features

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **PWA**: Service Worker, Web App Manifest

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd bolulife
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   Add your Supabase credentials to `.env.local`:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Netlify
1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables

### Manual Deployment
1. Build the project:
   ```bash
   npm run build
   ```
2. Upload the `dist` folder to your hosting provider

## 📁 Project Structure

```
src/
├── components/          # UI components
│   ├── HomePage.tsx    # Main dashboard
│   ├── Calendar.tsx    # Calendar functionality
│   ├── DailyAgenda.tsx # Daily task management
│   ├── Notes.tsx       # Note-taking system
│   ├── DevRoadmap.tsx  # Development tracking
│   ├── Finance.tsx     # Financial management
│   ├── PlantCare.tsx   # Plant care tracking
│   ├── HealthHabits.tsx # Health & habits
│   ├── JobCareer.tsx   # Job application tracking
│   ├── MoroCompany.tsx # Business management
│   ├── Portfolio.tsx   # Portfolio showcase
│   ├── Settings.tsx    # App settings
│   └── Layout.tsx      # Main layout wrapper
├── lib/                # Utility libraries
│   ├── database.ts     # Supabase database functions
│   ├── supabase.ts     # Supabase client configuration
│   ├── pwa.ts          # PWA service worker
│   └── notifications.ts # Notification handling
├── utils/              # Utility functions
│   └── eventTypes.ts   # TypeScript type definitions
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Live Demo

Visit the live application at: [Your deployed URL]

## 📝 License

This project is private and for personal use.

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

---

Built with ❤️ by Bolu Morolari