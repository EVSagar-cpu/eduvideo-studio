import { createContext, useContext, useState, useCallback } from 'react'
import { MOCK_VIDEOS, MOCK_ACTIVITY } from '../lib/mockData'
import { isDemoMode, getVideos, upsertVideo, updateVideoStatus } from '../lib/supabase'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [videos, setVideos] = useState(MOCK_VIDEOS)
  const [activity, setActivity] = useState(MOCK_ACTIVITY)
  const [pipelineMode, setPipelineMode] = useState('V2') // V1 | V2
  const [loading, setLoading] = useState(false)

  const addActivity = useCallback((msg, type = 'info') => {
    setActivity(prev => [
      { id: Date.now(), type, msg, time: 'just now' },
      ...prev.slice(0, 19)
    ])
  }, [])

  const loadVideos = useCallback(async () => {
    if (isDemoMode) return
    setLoading(true)
    try {
      const data = await getVideos()
      setVideos(data)
    } catch (e) {
      console.error('Load videos error:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  const addVideo = useCallback(async (video) => {
    const v = { ...video, id: video.id || `v${Date.now()}`, status: 'pending', createdAt: new Date().toISOString() }
    if (!isDemoMode) await upsertVideo(v)
    setVideos(prev => [v, ...prev])
    addActivity(`"${v.title}" ingested → awaiting classification`, 'info')
    return v
  }, [addActivity])

  const updateVideo = useCallback(async (id, updates) => {
    if (!isDemoMode) await updateVideoStatus(id, updates)
    setVideos(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v))
  }, [])

  // Derived stats
  const stats = {
    total: 2000,
    processed: videos.filter(v => v.status === 'done').length + 510,
    pending: videos.filter(v => v.status === 'pending').length + 1440,
    review: videos.filter(v => v.status === 'review').length + 23,
    enhance: videos.filter(v => v.route === 'enhance').length,
    recreate: videos.filter(v => v.route === 'recreate').length,
  }

  return (
    <AppContext.Provider value={{
      videos, activity, pipelineMode, setPipelineMode,
      loading, stats, addVideo, updateVideo, loadVideos, addActivity
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
