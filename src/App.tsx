import PlayerPlatform from './app/player/PlayerPlatform'
import AdminPlatform from './app/admin/AdminPlatform'

function App() {
  const isAdminRoute =
    typeof window !== 'undefined' &&
    window.location.pathname.toLowerCase().startsWith('/admin')

  return isAdminRoute ? <AdminPlatform /> : <PlayerPlatform />
}

export default App
