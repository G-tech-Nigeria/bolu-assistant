import React, { useState } from 'react'
import { testConnection, migrateAllData } from '../lib/database'
import { Database, Upload, CheckCircle, AlertCircle, Loader } from 'lucide-react'

const DatabaseMigration: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTestConnection = async () => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const result = await testConnection()
      setResults({ connection: result })
    } catch (err) {
      setError('Connection test failed')
    } finally {
      setLoading(false)
    }
  }

  const handleMigrateData = async () => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const result = await migrateAllData()
      setResults(result)
    } catch (err) {
      setError('Migration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Database className="w-6 h-6 text-blue-500" />
          Database Migration
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Test your Supabase connection and migrate data from localStorage to the database.
        </p>

        <div className="flex gap-4 mb-6">
          <button
            onClick={handleTestConnection}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Test Connection
          </button>

          <button
            onClick={handleMigrateData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Upload className="w-4 h-4" />
            Migrate All Data
          </button>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Loader className="w-4 h-4 animate-spin" />
            Processing...
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {results && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Results:</h3>
            
            {results.connection && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Connection Test:</h4>
                <pre className="text-sm text-gray-600 dark:text-gray-400">
                  {JSON.stringify(results.connection, null, 2)}
                </pre>
              </div>
            )}

            {results.calendar && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Calendar Events:</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {results.calendar.success ? 
                    `Successfully migrated ${results.calendar.migrated} events` : 
                    `Error: ${results.calendar.error?.message}`
                  }
                </p>
              </div>
            )}

            {results.agenda && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Agenda Tasks:</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {results.agenda.success ? 
                    `Successfully migrated ${results.agenda.migrated} tasks` : 
                    `Error: ${results.agenda.error?.message}`
                  }
                </p>
              </div>
            )}

            {results.plants && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Plants:</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {results.plants.success ? 
                    `Successfully migrated ${results.plants.migrated} plants` : 
                    `Error: ${results.plants.error?.message}`
                  }
                </p>
              </div>
            )}

            {results.health && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Health Habits:</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {results.health.success ? 
                    `Successfully migrated ${results.health.migrated} health data types` : 
                    `Error: ${results.health.error?.message}`
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DatabaseMigration 