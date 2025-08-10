export interface Event {
    id: string
    title: string
    date: string
    startTime?: string
    endTime?: string
    description?: string
    type: 'meeting' | 'task' | 'reminder' | 'appointment'
    priority?: 'low' | 'medium' | 'high'
}

export const getUpcomingEvents = (events: Event[]) => {
    const now = new Date()
    return events
        .filter(event => new Date(event.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export const formatEventDate = (date: string) => {
    const eventDate = new Date(date)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (eventDate.toDateString() === today.toDateString()) {
        return 'Today'
    } else if (eventDate.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow'
    } else {
        return eventDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: eventDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        })
    }
}
