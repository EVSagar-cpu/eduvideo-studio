import { Outlet } from 'react-router-dom'
import Topbar from './Topbar'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden' }}>
      <Topbar />
      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
        <Sidebar />
        <main style={{ flex:1, background:'var(--bg)', overflowY:'auto', overflowX:'hidden' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
