import { Dashboard } from './pages/dashboard/Dashboard';
import { Login } from './pages/authentication/Login';
import ChangePasswordPage from './pages/authentication/components/ChangePasswordPage';
import { Route, Routes } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import PrivateRoutes from './routes/PrivateRoutes';
import OauthCallback from './pages/authentication/components/OauthCallback';
import Stats from './pages/stats/Stats';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/google/callback" element={<OauthCallback.GoogleCallback />} />
      <Route path="/auth/github/callback" element={<OauthCallback.GithubCallback />} />
      <Route element={<PrivateRoutes/>}>
        {/* Layout with Header for all authenticated routes */}
        <Route element={<DashboardLayout />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/dashboard/stats' element={<Stats />} />
          <Route path='/change-password' element={<ChangePasswordPage />} />
        </Route>
      </Route>
      <Route path="*" element={<h1>404 - Page not found</h1>} />
    </Routes>
  )
}

export default App
