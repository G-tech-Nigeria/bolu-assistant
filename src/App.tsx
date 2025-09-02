import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './components/HomePage'
import Calendar from './components/Calendar'
import DailyAgenda from './components/DailyAgenda'
import Notes from './components/Notes'
import DevRoadmap from './components/DevRoadmap'
import CodingJourney from './components/CodingJourney'
import FinanceEnhanced from './components/FinanceEnhanced'
import PlantCare from './components/PlantCare'
import HealthHabits from './components/HealthHabits'
import MoroCompany from './components/MoroCompany'
import BusinessAreaPage from './components/BusinessAreaPage'
import JobCareer from './components/JobCareer'
import Portfolio from './components/Portfolio'
import BirthdayCalendar from './components/BirthdayCalendar'
import Accountability from './components/Accountability'
import Settings from './components/Settings'
import DatabaseMigration from './components/DatabaseMigration'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import WidgetPage from './components/WidgetPage'
import EnhancedDashboard from './components/EnhancedDashboard'
import GoalManagement from './components/GoalManagement'

import { pwaService } from './lib/pwa'
import { notificationService } from './lib/notifications'

function App() {
  useEffect(() => {
    // Initialize PWA functionality
    pwaService.initialize()
    
    // Initialize notification service for push notifications
    notificationService.initialize()
    
    // Check for service worker updates
    pwaService.checkForUpdates()
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Layout>
          <Routes>
            <Route path="/" element={<EnhancedDashboard />} />
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/goals" element={<GoalManagement />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/agenda" element={<DailyAgenda />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/dev-roadmap" element={<DevRoadmap />} />
            <Route path="/coding-journey" element={<CodingJourney />} />
            <Route path="/finance" element={<FinanceEnhanced />} />
            <Route path="/plant-care" element={<PlantCare />} />
            <Route path="/health-habits" element={<HealthHabits />} />
            <Route path="/company" element={<MoroCompany />} />
            <Route path="/company/:areaId" element={<BusinessAreaPage />} />
            <Route path="/job-career" element={<JobCareer />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/birthday-calendar" element={<BirthdayCalendar />} />
            <Route path="/accountability" element={<Accountability />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/migration" element={<DatabaseMigration />} />
            <Route path="/widgets" element={<WidgetPage />} />
          </Routes>
        </Layout>
        
        {/* PWA Install Prompt */}
        <PWAInstallPrompt />
      </div>
    </Router>
  )
}

export default App