import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import UploadIngest from './pages/UploadIngest'
import ReviewQueue from './pages/ReviewQueue'
import VideoDetail from './pages/VideoDetail'
import BatchQueue from './pages/BatchQueue'
import SceneEditor from './pages/SceneEditor'
import VoiceSelector from './pages/VoiceSelector'
import OutputLibrary from './pages/OutputLibrary'

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index            element={<Dashboard />} />
              <Route path="upload"    element={<UploadIngest />} />
              <Route path="queue"     element={<ReviewQueue />} />
              <Route path="video/:id" element={<VideoDetail />} />
              <Route path="batch"     element={<BatchQueue />} />
              <Route path="scenes"    element={<SceneEditor />} />
              <Route path="voices"    element={<VoiceSelector />} />
              <Route path="output"    element={<OutputLibrary />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  )
}
