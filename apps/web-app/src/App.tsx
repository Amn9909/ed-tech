import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicRoute from './routes/PublicRoutes';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ProtectedRoute from './routes/ProtectedRoutes';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
