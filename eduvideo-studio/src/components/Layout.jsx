import { Outlet } from 'react-router-dom'
import Topbar from './Topbar'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '220px 1fr',
      gridTemplateRows: '52px 1fr',
      height: '100vh',
      overflow: 'hidden',
    }}>
      <Topbar />
      <Sidebar />
      <main style={{ background: 'var(--navy)', overflowY: 'auto', overflowX: 'hidden' }}>
        <Outlet />
      </main>
    </div>
  )
}
