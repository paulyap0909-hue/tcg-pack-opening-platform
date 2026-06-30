import PlayerPlatform from './app/player/PlayerPlatform'
import AdminPlatform from './app/admin/AdminPlatform'
import PaymentStatusPage from './components/PaymentStatusPage'

function App() {
  const pathname =
    typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : ''

  if (pathname.startsWith('/payment/success')) {
    return <PaymentStatusPage status="success" />
  }

  if (pathname.startsWith('/payment/cancel')) {
    return <PaymentStatusPage status="cancel" />
  }

  const isAdminRoute = pathname.startsWith('/admin')

  return isAdminRoute ? <AdminPlatform /> : <PlayerPlatform />
}

export default App
