import { useState, useEffect } from 'react'
import { Droplets, Calendar, Trash2, X, Sprout, Zap, Plus } from 'lucide-react'
import { getPlants, updatePlant, deletePlant, addPlant } from '../lib/database'
import { supabase } from '../lib/supabase'


interface Plant {
    id: string
    name: string
    species: string
    location: string
    lastWatered: string
    nextWatering: string
    wateringFrequency: number // days
    lightNeeds: 'low' | 'medium' | 'high'
    humidityNeeds: 'low' | 'medium' | 'high'
    temperatureRange: string
    fertilizerFrequency: number // weeks
    lastFertilized: string
    notes: string
    health: 'excellent' | 'good' | 'fair' | 'poor'
    size: 'small' | 'medium' | 'large'
    potSize: string
    imageUrl?: string
    careTasks: CareTask[]
    potColor: string
    plantType: 'succulent' | 'tropical' | 'herb' | 'flower' | 'tree' | 'vine'
}

interface CareTask {
    id: string
    type: 'watering' | 'fertilizing' | 'pruning' | 'repotting' | 'cleaning' | 'rotating'
    dueDate: string
    completed: boolean
    notes?: string
}

const PlantCare = () => {
    const [plants, setPlants] = useState<Plant[]>([])
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)
    const [showPlantDetails, setShowPlantDetails] = useState(false)
    const [showAddPlant, setShowAddPlant] = useState(false)
    const [showAddTaskModal, setShowAddTaskModal] = useState(false)
    const [wateringAnimation, setWateringAnimation] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    // Helper function to calculate next watering date
    const calculateNextWatering = (frequency: number) => {
        return new Date(Date.now() + frequency * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }









    const [newPlant, setNewPlant] = useState<Omit<Plant, 'id'>>(() => {
        const defaultFrequency = 7
        return {
            name: '',
            species: '',
            location: '',
            lastWatered: new Date().toISOString().split('T')[0],
            nextWatering: calculateNextWatering(defaultFrequency),
            wateringFrequency: defaultFrequency,
            lightNeeds: 'medium' as const,
            humidityNeeds: 'medium' as const,
            temperatureRange: '18-24°C',
            fertilizerFrequency: 4,
            lastFertilized: new Date().toISOString().split('T')[0],
            notes: '',
            health: 'good' as const,
            size: 'medium' as const,
            potSize: '',
            imageUrl: '',
            careTasks: [],
            potColor: '#8B4513',
            plantType: 'tropical' as const
        }
    })

    // Update nextWatering when wateringFrequency changes
    const updateNextWatering = (frequency: number) => {
        setNewPlant(prev => ({ ...prev, nextWatering: calculateNextWatering(frequency) }))
    }
    const [taskForm, setTaskForm] = useState({
        type: 'watering' as CareTask['type'],
        dueDate: new Date().toISOString().split('T')[0],
        notes: '',
        plantId: ''
    })
    

    useEffect(() => {
        const loadPlants = async () => {
            try {
                setIsLoading(true)
                
                const dbPlants = await getPlants()
                const convertedPlants = dbPlants.map((plant: any) => ({
                    id: plant.id,
                    name: plant.name,
                    species: plant.species || '',
                    location: plant.location || '',
                    lastWatered: plant.last_watered || new Date().toISOString(),
                    nextWatering: plant.next_watering || new Date().toISOString(),
                    wateringFrequency: plant.watering_frequency || 7,
                    lightNeeds: (plant.light_needs || 'medium') as 'low' | 'medium' | 'high',
                    humidityNeeds: (plant.humidity_needs || 'medium') as 'low' | 'medium' | 'high',
                    temperatureRange: plant.temperature_range || '18-24°C',
                    fertilizerFrequency: plant.fertilizer_frequency || 2,
                    lastFertilized: plant.last_fertilized || new Date().toISOString(),
                    notes: plant.notes || '',
                    health: (plant.health || 'good') as 'excellent' | 'good' | 'fair' | 'poor',
                    size: (plant.size || 'medium') as 'small' | 'medium' | 'large',
                    potSize: plant.pot_size || '',
                    imageUrl: plant.image_url,
                    careTasks: plant.care_tasks || [],
                    potColor: plant.pot_color || '#8B4513',
                    plantType: (plant.plant_type || 'tropical') as 'succulent' | 'tropical' | 'herb' | 'flower' | 'tree' | 'vine'
                }))
                setPlants(convertedPlants)
                
                // If no plants exist, offer to migrate default plants
                if (convertedPlants.length === 0) {
    
                }
                
            } catch (error) {
                console.error('Error loading plants:', error)
                setPlants([])
            } finally {
                setIsLoading(false)
            }
        }
        
        loadPlants()
        
        // Notification services removed
    }, [])

    const waterPlant = async (plantId: string) => {
        try {
            setWateringAnimation(plantId)
            setTimeout(() => setWateringAnimation(null), 2000)
            
            // Find the plant to water
            const plantToWater = plants.find(p => p.id === plantId)
            if (!plantToWater) return
            
            // Calculate new dates
            const today = new Date().toISOString().split('T')[0]
            const nextWatering = new Date(Date.now() + plantToWater.wateringFrequency * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            const newHealth = (plantToWater.health === 'poor' ? 'fair' : plantToWater.health === 'fair' ? 'good' : 'excellent') as 'excellent' | 'good' | 'fair' | 'poor'
            
            // Update plant in database
            await updatePlant(plantId, {
                last_watered: today,
                next_watering: nextWatering,
                health: newHealth
            })
            
            // Update local state
            const updatedPlants = plants.map(plant => {
                if (plant.id === plantId) {
                    return {
                        ...plant,
                        lastWatered: today,
                        nextWatering: nextWatering,
                        health: newHealth
                    }
                }
                return plant
            })
            setPlants(updatedPlants)
            
            // Manage watering notification in database
            // Plant notification removed
            
            // Send plant care notification
            try {
                // Plant watering notification removed;
            } catch (error) {
                console.error('Failed to send plant watering notification:', error);
            }
            
        } catch (error) {
            console.error('Error watering plant:', error)
        }
    }

    const deletePlantFromDatabase = async (plantId: string) => {
        try {
            await deletePlant(plantId)
            setPlants(plants.filter(p => p.id !== plantId))
            
            // Close the plant details modal if the deleted plant was selected
            if (selectedPlant && selectedPlant.id === plantId) {
                setSelectedPlant(null)
                setShowPlantDetails(false)
            }
        } catch (error) {
            console.error('Error deleting plant:', error)
        }
    }

    const addNewPlant = async () => {
        try {
            if (!newPlant.name.trim()) {
                alert('Please enter a plant name')
                return
            }

            const plantData = {
                name: newPlant.name,
                species: newPlant.species,
                location: newPlant.location,
                lastWatered: newPlant.lastWatered,
                nextWatering: newPlant.nextWatering,
                wateringFrequency: newPlant.wateringFrequency,
                lightNeeds: newPlant.lightNeeds,
                humidityNeeds: newPlant.humidityNeeds,
                temperatureRange: newPlant.temperatureRange,
                fertilizerFrequency: newPlant.fertilizerFrequency,
                lastFertilized: newPlant.lastFertilized,
                notes: newPlant.notes,
                health: newPlant.health,
                size: newPlant.size,
                potSize: newPlant.potSize,
                imageUrl: newPlant.imageUrl,
                careTasks: newPlant.careTasks,
                potColor: newPlant.potColor,
                plantType: newPlant.plantType
            }

            const addedPlant = await addPlant(plantData)
            
            // Convert back to frontend format
            const convertedPlant: Plant = {
                id: addedPlant.id,
                name: addedPlant.name,
                species: addedPlant.species || '',
                location: addedPlant.location || '',
                lastWatered: addedPlant.last_watered || new Date().toISOString(),
                nextWatering: addedPlant.next_watering || new Date().toISOString(),
                wateringFrequency: addedPlant.watering_frequency || 7,
                lightNeeds: (addedPlant.light_needs || 'medium') as 'low' | 'medium' | 'high',
                humidityNeeds: (addedPlant.humidity_needs || 'medium') as 'low' | 'medium' | 'high',
                temperatureRange: addedPlant.temperature_range || '18-24°C',
                fertilizerFrequency: addedPlant.fertilizer_frequency || 2,
                lastFertilized: addedPlant.last_fertilized || new Date().toISOString(),
                notes: addedPlant.notes || '',
                health: (addedPlant.health || 'good') as 'excellent' | 'good' | 'fair' | 'poor',
                size: (addedPlant.size || 'medium') as 'small' | 'medium' | 'large',
                potSize: addedPlant.pot_size || '',
                imageUrl: addedPlant.image_url,
                careTasks: addedPlant.care_tasks || [],
                potColor: addedPlant.pot_color || '#8B4513',
                plantType: (addedPlant.plant_type || 'tropical') as 'succulent' | 'tropical' | 'herb' | 'flower' | 'tree' | 'vine'
            }

            setPlants([...plants, convertedPlant])
            
            // Manage watering notification in database
            // Plant notification removed
            
            // Reset form
            const defaultFrequency = 7
            setNewPlant({
                name: '',
                species: '',
                location: '',
                lastWatered: new Date().toISOString().split('T')[0],
                nextWatering: calculateNextWatering(defaultFrequency),
                wateringFrequency: defaultFrequency,
                lightNeeds: 'medium',
                humidityNeeds: 'medium',
                temperatureRange: '18-24°C',
                fertilizerFrequency: 4,
                lastFertilized: new Date().toISOString().split('T')[0],
                notes: '',
                health: 'good',
                size: 'medium',
                potSize: '',
                imageUrl: '',
                careTasks: [],
                potColor: '#8B4513',
                plantType: 'tropical'
            })
            
            setShowAddPlant(false)
            
        } catch (error) {
            console.error('Error adding plant:', error)
            alert('Error adding plant. Please try again.')
        }
    }

    const addCustomTask = async () => {
        if (!taskForm.plantId || !taskForm.type || !taskForm.dueDate) {
            alert('Please select a plant and fill in all required fields')
            return
        }

        try {
            const targetPlant = plants.find(p => p.id === taskForm.plantId)
            if (!targetPlant) {
                alert('Selected plant not found')
                return
            }

            const newTask: CareTask = {
                id: Date.now().toString(),
                type: taskForm.type,
                dueDate: taskForm.dueDate,
                completed: false,
                notes: taskForm.notes
            }

            const updatedTasks = [...targetPlant.careTasks, newTask]
            
            // Update plant in database
            await updatePlant(targetPlant.id, {
                care_tasks: updatedTasks
            })

            // Update local state
            const updatedPlant = { ...targetPlant, careTasks: updatedTasks }
            setPlants(plants.map(p => p.id === targetPlant.id ? updatedPlant : p))
            
            // Update selectedPlant if it's the same plant
            if (selectedPlant && selectedPlant.id === targetPlant.id) {
                setSelectedPlant(updatedPlant)
            }

            // Reset form
            setTaskForm({
                type: 'watering',
                dueDate: new Date().toISOString().split('T')[0],
                notes: '',
                plantId: ''
            })
            setShowAddTaskModal(false)

        } catch (error) {
            console.error('Error adding task:', error)
            alert('Error adding task. Please try again.')
        }
    }

    const completeTask = async (taskId: string) => {
        try {
            // Find which plant has this task
            const targetPlant = plants.find(plant => 
                plant.careTasks.some(task => task.id === taskId)
            )
            
            if (!targetPlant) return

            // Remove the completed task instead of marking it as completed
            const updatedTasks = targetPlant.careTasks.filter(task => task.id !== taskId)

            // Update plant in database
            await updatePlant(targetPlant.id, {
                care_tasks: updatedTasks
            })

            // Update local state
            const updatedPlant = { ...targetPlant, careTasks: updatedTasks }
            setPlants(plants.map(p => p.id === targetPlant.id ? updatedPlant : p))
            
            // Update selectedPlant if it's the same plant
            if (selectedPlant && selectedPlant.id === targetPlant.id) {
                setSelectedPlant(updatedPlant)
            }

        } catch (error) {
            console.error('Error completing task:', error)
        }
    }



    const getDaysUntilWatering = (plant: Plant) => {
        const nextWatering = new Date(plant.nextWatering)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        nextWatering.setHours(0, 0, 0, 0)
        const diffTime = nextWatering.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    const getPlantVisual = (plant: Plant) => {
        return (
            <div className="relative w-full h-full flex items-end justify-center">
                {/* Plant base/soil */}
                <div className="absolute bottom-0 w-8 h-2 bg-amber-800 rounded-full opacity-60"></div>
                
                {/* Plant body */}
                <div className="relative flex flex-col items-center">
                    {/* Main plant structure */}
                    <div className="flex flex-col items-center">
                        
                        {/* Plant type specific details */}
                        {plant.plantType === 'succulent' && (
                            <div className="w-6 h-8 bg-green-400 rounded-full relative">
                                <div className="absolute top-1 left-1 w-1 h-1 bg-green-600 rounded-full"></div>
                                <div className="absolute top-2 right-1 w-1 h-1 bg-green-600 rounded-full"></div>
                                <div className="absolute bottom-2 left-2 w-1 h-1 bg-green-600 rounded-full"></div>
                            </div>
                        )}
                        
                        {plant.plantType === 'tropical' && (
                            <div className="flex space-x-1">
                                <div className="w-2 h-6 bg-green-500 rounded-full transform -rotate-12"></div>
                                <div className="w-2 h-8 bg-green-600 rounded-full"></div>
                                <div className="w-2 h-6 bg-green-500 rounded-full transform rotate-12"></div>
                            </div>
                        )}
                        
                        {plant.plantType === 'herb' && (
                            <div className="flex space-x-0.5">
                                <div className="w-1 h-4 bg-green-400 rounded-full"></div>
                                <div className="w-1 h-5 bg-green-500 rounded-full"></div>
                                <div className="w-1 h-4 bg-green-400 rounded-full"></div>
                                <div className="w-1 h-3 bg-green-300 rounded-full"></div>
                            </div>
                        )}
                        
                        {plant.plantType === 'flower' && (
                            <div className="relative">
                                <div className="w-1 h-6 bg-green-600 rounded-full"></div>
                                {/* Flower center */}
                                <div className="absolute -top-1 -left-1 w-3 h-3 bg-pink-400 rounded-full">
                                    {/* Flower petals */}
                                    <div className="absolute -top-0.5 left-1 w-1 h-1 bg-pink-300 rounded-full"></div>
                                    <div className="absolute top-1 -left-0.5 w-1 h-1 bg-pink-300 rounded-full"></div>
                                    <div className="absolute top-1 -right-0.5 w-1 h-1 bg-pink-300 rounded-full"></div>
                                    <div className="absolute -bottom-0.5 left-1 w-1 h-1 bg-pink-300 rounded-full"></div>
                                    {/* Additional petals */}
                                    <div className="absolute -top-0.5 left-0 w-1 h-1 bg-pink-200 rounded-full"></div>
                                    <div className="absolute -top-0.5 right-0 w-1 h-1 bg-pink-200 rounded-full"></div>
                                </div>
                            </div>
                        )}
                        
                        {plant.plantType === 'vine' && (
                            <div className="relative">
                                <div className="w-1 h-4 bg-green-600 rounded-full"></div>
                                <div className="absolute -top-1 -left-2 w-1 h-3 bg-green-500 rounded-full transform rotate-45"></div>
                                <div className="absolute -top-1 -right-2 w-1 h-3 bg-green-500 rounded-full transform -rotate-45"></div>
                            </div>
                        )}
                        
                        {plant.plantType === 'tree' && (
                            <div className="relative">
                                <div className="w-2 h-6 bg-amber-700 rounded-full"></div>
                                <div className="absolute -top-2 -left-1 w-4 h-4 bg-green-600 rounded-full"></div>
                                <div className="absolute -top-1 -left-2 w-2 h-2 bg-green-500 rounded-full"></div>
                                <div className="absolute -top-1 right-0 w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Watering animation */}
                {wateringAnimation === plant.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-bounce">
                            <Droplets className="w-6 h-6 text-blue-500" />
                        </div>
                    </div>
                )}
                
            </div>
        )
    }

    const getHealthIndicator = (health: Plant['health']) => {
        const indicators = {
            excellent: { color: 'bg-green-500', text: 'Excellent', emoji: '🌟' },
            good: { color: 'bg-blue-500', text: 'Good', emoji: '✅' },
            fair: { color: 'bg-yellow-500', text: 'Fair', emoji: '⚠️' },
            poor: { color: 'bg-red-500', text: 'Poor', emoji: '🔴' }
        }
        return indicators[health]
    }

    const todayTasks = plants.flatMap(plant => {
        const daysUntil = getDaysUntilWatering(plant)
        const tasks = []
        
        if (daysUntil <= 0) {
            tasks.push({
                id: `water-${plant.id}`,
                type: 'watering' as const,
                plant: plant,
                urgent: daysUntil < 0,
                daysOverdue: Math.abs(daysUntil)
            })
        }
        
        return tasks
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-green-900">
            <div className="container mx-auto px-4 py-6 md:py-8">
                {/* Garden Header */}
                <div className="text-center mb-6 md:mb-8">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 md:mb-4">
                        🌱 My Plant Garden
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
                        Care for your green friends and watch them flourish
                    </p>
                    
                    {/* Add Plant Button */}
                    <div className="mt-4 md:mt-6">
                        <button
                            onClick={() => setShowAddPlant(true)}
                            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <Plus className="w-4 h-4 md:w-5 md:h-5" />
                            Add New Plant
                        </button>
                    </div>
                </div>

                {/* Garden Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
                    <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl md:rounded-2xl p-3 md:p-6 text-center backdrop-blur-sm border border-white/20 shadow-sm">
                        <div className="text-xl md:text-3xl font-bold text-green-600 dark:text-green-400">{plants.length}</div>
                        <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Total Plants</div>
                    </div>
                    <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl md:rounded-2xl p-3 md:p-6 text-center backdrop-blur-sm border border-white/20 shadow-sm">
                        <div className="text-xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                            {plants.filter(p => p.health === 'excellent').length}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Healthy</div>
                    </div>
                    <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl md:rounded-2xl p-3 md:p-6 text-center backdrop-blur-sm border border-white/20 shadow-sm">
                        <div className="text-xl md:text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                            {todayTasks.length}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Tasks Today</div>
                    </div>
                    <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl md:rounded-2xl p-3 md:p-6 text-center backdrop-blur-sm border border-white/20 shadow-sm">
                        <div className="text-xl md:text-3xl font-bold text-red-600 dark:text-red-400">
                            {plants.filter(p => getDaysUntilWatering(p) <= 0).length}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Need Water</div>
                    </div>
                </div>

                {/* Garden Layout */}
                {plants.length > 0 && (
                    <div className="relative mb-6 md:mb-8">
                        {/* Garden background with grass effect */}
                        <div className="bg-gradient-to-b from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 rounded-2xl md:rounded-3xl p-4 md:p-8 min-h-[300px] md:min-h-[400px] relative overflow-hidden">
                            
                            {/* Plants arranged in a garden-like pattern */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
                                {plants.map((plant) => (
                                    <div
                                        key={plant.id}
                                        className="relative group cursor-pointer transform hover:scale-105 transition-all duration-300"
                                        onClick={() => {
                                            setSelectedPlant(plant)
                                            setShowPlantDetails(true)
                                        }}
                                    >
                                        {/* Garden soil base */}
                                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-amber-900 rounded-full opacity-30"></div>
                                        
                                        {/* Plant Pot */}
                                        <div className="relative flex flex-col items-center">
                                            {/* Pot with better design */}
                                            <div className="relative mb-2">
                                                <div 
                                                    className="w-12 h-8 md:w-16 md:h-10 rounded-lg shadow-lg relative overflow-hidden"
                                                    style={{ backgroundColor: plant.potColor }}
                                                >
                                                    {/* Pot texture */}
                                                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-black/20"></div>
                                                    
                                                    {/* Pot rim with better design */}
                                                    <div 
                                                        className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-14 h-2 md:w-18 md:h-3 rounded-full shadow-inner"
                                                        style={{ backgroundColor: plant.potColor }}
                                                    ></div>
                                                    
                                                    {/* Pot decoration lines */}
                                                    <div className="absolute top-2 left-1 right-1 h-px bg-black/10"></div>
                                                    <div className="absolute top-4 left-1 right-1 h-px bg-black/10 hidden md:block"></div>
                                                </div>
                                                
                                                {/* Plant with flowers */}
                                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-12 md:w-10 md:h-16">
                                                    {getPlantVisual(plant)}
                                                </div>
                                            </div>
                                            
                                            {/* Watering indicator */}
                                            {getDaysUntilWatering(plant) <= 0 && (
                                                <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                                                    <Droplets className="w-2 h-2 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Plant Name */}
                                        <div className="text-center mt-2 px-1">
                                            <div className="text-xs md:text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                                                {plant.name}
                                            </div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                                {plant.species}
                                            </div>
                                            {/* Days until watering */}
                                            <div className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${
                                                getDaysUntilWatering(plant) <= 0 
                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                                                    : getDaysUntilWatering(plant) <= 2 
                                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            }`}>
                                                {getDaysUntilWatering(plant) <= 0 ? 'Water now!' : `${getDaysUntilWatering(plant)}d`}
                                            </div>
                                        </div>
                                        
                                        {/* Quick Actions */}
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    waterPlant(plant.id)
                                                }}
                                                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors shadow-lg"
                                            >
                                                <Droplets className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                    
                {/* Loading State */}
                {plants.length === 0 && isLoading && (
                    <div className="text-center py-12 md:py-16">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-white/50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20 shadow-sm">
                            <Sprout className="w-12 h-12 md:w-16 md:h-16 text-gray-400 animate-pulse" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">Loading your garden...</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto px-4">
                            Please wait while we load your plants from the database.
                        </p>
                    </div>
                )}

                {/* Today's Tasks */}
                {todayTasks.length > 0 && (
                    <div className="bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 backdrop-blur-sm border border-white/20 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Today's Care Tasks ({todayTasks.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {todayTasks.map(task => {
                                const daysOverdue = task.type === 'watering' ? getDaysUntilWatering(task.plant) : 0
                                return (
                                    <div key={task.id} className={`p-4 rounded-xl border-2 ${
                                        task.urgent 
                                            ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10' 
                                            : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-700/50'
                                    }`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                task.type === 'watering' 
                                                    ? 'bg-blue-100 dark:bg-blue-900/30' 
                                                    : 'bg-yellow-100 dark:bg-yellow-900/30'
                                            }`}>
                                                {task.type === 'watering' ? (
                                                    <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                ) : (
                                                    <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                                    Water {task.plant.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {task.urgent && daysOverdue < 0 && `${Math.abs(daysOverdue)} days overdue`}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => waterPlant(task.plant.id)}
                                                className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                                            >
                                                Water
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Task Management Section */}
                <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl md:rounded-2xl p-4 md:p-6 mb-6 md:mb-8 backdrop-blur-sm border border-white/20 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4 mb-4 md:mb-6">
                        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Calendar className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                            <span className="truncate">Plant Care Tasks</span>
                        </h2>
                        <button
                            onClick={() => setShowAddTaskModal(true)}
                            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 md:px-4 py-2 md:py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg touch-manipulation min-h-[44px] whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="hidden sm:inline">Add Task</span>
                            <span className="sm:hidden">Add</span>
                        </button>
                    </div>

                    {/* All Tasks from All Plants */}
                    <div className="space-y-3">
                        {plants.length > 0 ? (
                            plants.flatMap(plant => 
                                plant.careTasks.map(task => ({
                                    ...task,
                                    plantName: plant.name,
                                    plantId: plant.id
                                }))
                            ).length > 0 ? (
                                <div className="grid gap-3">
                                    {plants.flatMap(plant => 
                                        plant.careTasks.map(task => ({
                                            ...task,
                                            plantName: plant.name,
                                            plantId: plant.id
                                        }))
                                    ).map((task) => (
                                        <div
                                            key={`${task.plantId}-${task.id}`}
                                            className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg md:rounded-xl border transition-all duration-300 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600"
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <button
                                                    onClick={() => completeTask(task.id)}
                                                    className="w-8 h-8 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 border-gray-300 dark:border-gray-500 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 touch-manipulation flex-shrink-0"
                                                    title="Mark as completed (will delete task)"
                                                >
                                                    <span className="text-sm md:text-xs">✓</span>
                                                </button>
                                                
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-semibold text-sm md:text-base text-gray-900 dark:text-white truncate">
                                                        {task.type.charAt(0).toUpperCase() + task.type.slice(1)} - {task.plantName}
                                                    </div>
                                                    <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        <span className="block sm:inline">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                                        {task.notes && (
                                                            <span className="block sm:inline sm:ml-2">
                                                                <span className="hidden sm:inline">• </span>
                                                                <span className="line-clamp-1">{task.notes}</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 text-center ${
                                                new Date(task.dueDate) < new Date()
                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                                                    : new Date(task.dueDate).toDateString() === new Date().toDateString()
                                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                                            }`}>
                                                {new Date(task.dueDate) < new Date()
                                                    ? 'Overdue'
                                                    : new Date(task.dueDate).toDateString() === new Date().toDateString()
                                                        ? 'Today'
                                                        : 'Upcoming'
                                                }
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 md:py-8 px-4 text-gray-500 dark:text-gray-400">
                                    <Calendar className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 opacity-50" />
                                    <p className="text-base md:text-lg font-medium mb-2">No care tasks yet</p>
                                    <p className="text-xs md:text-sm max-w-sm mx-auto">Add custom care tasks to keep track of your plant care schedule</p>
                                </div>
                            )
                        ) : (
                            <div className="text-center py-6 md:py-8 px-4 text-gray-500 dark:text-gray-400">
                                <Sprout className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 opacity-50" />
                                <p className="text-base md:text-lg font-medium mb-2">Add plants first</p>
                                <p className="text-xs md:text-sm max-w-sm mx-auto">You need plants before you can create care tasks</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Plant Details Modal */}
            {showPlantDetails && selectedPlant && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl max-w-md w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4 md:mb-6">
                            <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">{selectedPlant.name}</h3>
                            <button
                                onClick={() => setShowPlantDetails(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="text-center mb-6">
                            <div className="relative inline-block">
                                <div 
                                    className="w-20 h-16 rounded-lg shadow-lg relative overflow-hidden mb-4"
                                    style={{ backgroundColor: selectedPlant.potColor }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-black/20"></div>
                                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-20">
                                        {getPlantVisual(selectedPlant)}
                                    </div>
                                </div>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedPlant.species}</h4>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <span className={`w-3 h-3 rounded-full ${getHealthIndicator(selectedPlant.health).color}`}></span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {getHealthIndicator(selectedPlant.health).emoji} {selectedPlant.health}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Location:</span>
                                    <div className="font-medium text-gray-900 dark:text-white">{selectedPlant.location}</div>
                                </div>
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Size:</span>
                                    <div className="font-medium text-gray-900 dark:text-white capitalize">{selectedPlant.size}</div>
                                </div>
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Light:</span>
                                    <div className="font-medium text-gray-900 dark:text-white capitalize">{selectedPlant.lightNeeds}</div>
                                </div>
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Humidity:</span>
                                    <div className="font-medium text-gray-900 dark:text-white capitalize">{selectedPlant.humidityNeeds}</div>
                                </div>
                            </div>

                            <div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm">Last Watered:</span>
                                <div className="font-medium text-gray-900 dark:text-white">
                                    {new Date(selectedPlant.lastWatered).toLocaleDateString()}
                                </div>
                            </div>


                            
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        waterPlant(selectedPlant.id)
                                        setShowPlantDetails(false)
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    <Droplets className="w-4 h-4" />
                                    Water
                                </button>
                            </div>
                            
                            <button
                                onClick={() => deletePlantFromDatabase(selectedPlant.id)}
                                className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                Remove Plant
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Plant Modal */}
            {showAddPlant && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Plant</h2>
                            <button
                                onClick={() => setShowAddPlant(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Plant Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={newPlant.name}
                                        onChange={(e) => setNewPlant({ ...newPlant, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="e.g., My Monstera"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Species
                                    </label>
                                    <input
                                        type="text"
                                        value={newPlant.species}
                                        onChange={(e) => setNewPlant({ ...newPlant, species: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="e.g., Monstera Deliciosa"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={newPlant.location}
                                        onChange={(e) => setNewPlant({ ...newPlant, location: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="e.g., Living Room"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Plant Type
                                    </label>
                                    <select
                                        value={newPlant.plantType}
                                        onChange={(e) => setNewPlant({ ...newPlant, plantType: e.target.value as Plant['plantType'] })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="tropical">Tropical</option>
                                        <option value="succulent">Succulent</option>
                                        <option value="herb">Herb</option>
                                        <option value="flower">Flower</option>
                                        <option value="tree">Tree</option>
                                        <option value="vine">Vine</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Light Needs
                                    </label>
                                    <select
                                        value={newPlant.lightNeeds}
                                        onChange={(e) => setNewPlant({ ...newPlant, lightNeeds: e.target.value as Plant['lightNeeds'] })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Humidity Needs
                                    </label>
                                    <select
                                        value={newPlant.humidityNeeds}
                                        onChange={(e) => setNewPlant({ ...newPlant, humidityNeeds: e.target.value as Plant['humidityNeeds'] })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Watering Frequency (days)
                                    </label>
                                    <input
                                        type="number"
                                        value={newPlant.wateringFrequency}
                                        onChange={(e) => {
                                            const frequency = parseInt(e.target.value) || 7
                                            setNewPlant({ ...newPlant, wateringFrequency: frequency })
                                            updateNextWatering(frequency)
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        min="1"
                                        max="30"
                                    />
                                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        Next watering: {new Date(newPlant.nextWatering).toLocaleDateString()}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Size
                                    </label>
                                    <select
                                        value={newPlant.size}
                                        onChange={(e) => setNewPlant({ ...newPlant, size: e.target.value as Plant['size'] })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="small">Small</option>
                                        <option value="medium">Medium</option>
                                        <option value="large">Large</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Notes
                                </label>
                                <textarea
                                    value={newPlant.notes}
                                    onChange={(e) => setNewPlant({ ...newPlant, notes: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    rows={3}
                                    placeholder="Any special care notes..."
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowAddPlant(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={addNewPlant}
                                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    Add Plant
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Task Modal */}
            {showAddTaskModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 md:p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 w-full max-w-sm md:max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4 md:mb-6">
                            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Add Care Task</h2>
                            <button
                                onClick={() => setShowAddTaskModal(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors touch-manipulation"
                            >
                                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Select Plant *
                                </label>
                                <select
                                    value={taskForm.plantId}
                                    onChange={(e) => setTaskForm({ ...taskForm, plantId: e.target.value })}
                                    className="w-full px-3 py-3 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent touch-manipulation text-base"
                                >
                                    <option value="">Choose a plant...</option>
                                    {plants.map(plant => (
                                        <option key={plant.id} value={plant.id}>
                                            {plant.name} ({plant.species})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Task Type
                                </label>
                                <select
                                    value={taskForm.type}
                                    onChange={(e) => setTaskForm({ ...taskForm, type: e.target.value as CareTask['type'] })}
                                    className="w-full px-3 py-3 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent touch-manipulation text-base"
                                >
                                    <option value="watering">Watering</option>
                                    <option value="fertilizing">Fertilizing</option>
                                    <option value="pruning">Pruning</option>
                                    <option value="repotting">Repotting</option>
                                    <option value="cleaning">Cleaning</option>
                                    <option value="rotating">Rotating</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    value={taskForm.dueDate}
                                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                                    className="w-full px-3 py-3 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent touch-manipulation text-base"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    value={taskForm.notes}
                                    onChange={(e) => setTaskForm({ ...taskForm, notes: e.target.value })}
                                    className="w-full px-3 py-3 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent touch-manipulation text-base resize-none"
                                    rows={3}
                                    placeholder="Any additional notes..."
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <button
                                    onClick={() => setShowAddTaskModal(false)}
                                    className="flex-1 px-4 py-3 md:py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors touch-manipulation min-h-[44px] flex items-center justify-center"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={addCustomTask}
                                    className="flex-1 px-4 py-3 md:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors touch-manipulation min-h-[44px] flex items-center justify-center"
                                >
                                    Add Task
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PlantCare