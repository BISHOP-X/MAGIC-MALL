import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardLayout from './components/DashboardLayout'
import AdminLayout from './components/AdminLayout'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import PasswordReset from './pages/PasswordReset'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import MyOrders from './pages/MyOrders'
import AddFunds from './pages/AddFunds'
import PaymentProcessing from './pages/PaymentProcessing'
import PaymentSuccess from './pages/PaymentSuccess'
import Profile from './pages/Profile'
import Rules from './pages/Rules'
import CustomerCare from './pages/CustomerCare'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminManageLogs from './pages/admin/AdminManageLogs'
import AdminOrders from './pages/admin/AdminOrders'
import AdminUsers from './pages/admin/AdminUsers'
import AdminProfit from './pages/admin/AdminProfit'
import AdminPaymentMethod from './pages/admin/AdminPaymentMethod'
import LandingPage from './pages/LandingPage'
import { useTheme } from './hooks/useTheme'
import { AuthProvider } from './hooks/useAuth'

function App() {
  const { dark } = useTheme()

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

  return (
    <BrowserRouter>
      <AuthProvider>
          <div className="min-h-screen bg-[#fafafa] dark:bg-[#0c0f1a] text-gray-900 dark:text-white antialiased transition-colors duration-300">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<MyOrders />} />
              <Route path="add-funds" element={<AddFunds />} />
              <Route path="payment-processing" element={<PaymentProcessing />} />
              <Route path="payment-success" element={<PaymentSuccess />} />
              <Route path="profile" element={<Profile />} />
              <Route path="rules" element={<Rules />} />
              <Route path="support" element={<CustomerCare />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="logs" element={<AdminManageLogs />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="profit" element={<AdminProfit />} />
              <Route path="payments" element={<AdminPaymentMethod />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
