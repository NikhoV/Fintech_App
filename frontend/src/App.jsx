import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard'; // La creeremo tra un attimo
import Conto_Details from './pages/Conto_Details'; // La creeremo tra un attimo
import Notification from './components/Notification'; 
import './App.css';

function App() {
  // Funzione per controllare se l'utente ha il permesso (Token)
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/" />;
  };

  return (
    <Router>
      <Routes>
        {/* Pagina iniziale: Login/Register */}
        <Route path="/" element={<Auth />} />

        {/* Pagina protetta: Il Conto */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/conto/:id_conto" 
          element={
            <ProtectedRoute>
              <Conto_Details />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App; 