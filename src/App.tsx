import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { getUserPreference, setUserPreference } from './lib/database'
import { pwaService } from './lib/pwa'
import Layout from './components/Layout'
import HomePage from './components/HomePage'
import DailyAgenda from './components/DailyAgenda'
import Calendar from './components/Calendar'
import Notes from './components/Notes'
import DevRoadmap from './components/DevRoadmap'
import CodingJourney from './components/CodingJourney'
import Finance from './components/Finance'
import PlantCare from './components/PlantCare'
import HealthHabits from './components/HealthHabits'
import MoroCompany from './components/MoroCompany'
import BusinessAreaPage from './components/BusinessAreaPage'
import JobCareer from './components/JobCareer'
import Portfolio from './components/Portfolio'
import Accountability from './components/Accountability'
import Settings from './components/Settings'
import DatabaseMigration from './components/DatabaseMigration'
import PWAInstallPrompt from './components/PWAInstallPrompt'

import { Moon, Sun } from 'lucide-react'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Load theme preference from database
    const loadTheme = async () => {
      try {
        const savedTheme = await getUserPreference('theme')
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
          setDarkMode(true)
          document.documentElement.classList.add('dark')
        } else {
          setDarkMode(false)
          document.documentElement.classList.remove('dark')
        }
      } catch (error) {
        console.error('Error loading theme preference:', error)
        // Fallback to system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (prefersDark) {
          setDarkMode(true)
          document.documentElement.classList.add('dark')
        }
      }
    }

    loadTheme()
    
    // Initialize PWA functionality
    pwaService.initialize()
    
    // Check for service worker updates
    pwaService.checkForUpdates()
  }, [])

  const toggleDarkMode = async () => {
    try {
      if (darkMode) {
        document.documentElement.classList.remove('dark')
        await setUserPreference('theme', 'light')
      } else {
        document.documentElement.classList.add('dark')
        await setUserPreference('theme', 'dark')
      }
      setDarkMode(!darkMode)
    } catch (error) {
      console.error('Error saving theme preference:', error)
      // Still toggle the theme even if saving fails
      setDarkMode(!darkMode)
    }
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Theme toggle button */}
        <button
          onClick={toggleDarkMode}
          className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          )}
        </button>



        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/agenda" element={<DailyAgenda />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/dev-roadmap" element={<DevRoadmap />} />
            <Route path="/coding-journey" element={<CodingJourney />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/plant-care" element={<PlantCare />} />
            <Route path="/health-habits" element={<HealthHabits />} />
            <Route path="/company" element={<MoroCompany />} />
            <Route path="/company/:areaId" element={<BusinessAreaPage />} />
            <Route path="/job-career" element={<JobCareer />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/accountability" element={<Accountability />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/migration" element={<DatabaseMigration />} />
          </Routes>
        </Layout>
        
                    {/* PWA Install Prompt */}
            <PWAInstallPrompt />
      </div>
    </Router>
  )
}

export default App