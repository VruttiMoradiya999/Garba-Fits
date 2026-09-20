import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import './styles/style-base.css';

// Scroll to top helper
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Layout wrapper
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Initial activeTab determined by URL
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window === 'undefined') return 'home';
    const path = window.location.pathname.replace('/', '');
    return ['rent', 'about', 'contact'].includes(path) ? path : 'home';
  });
  const [requestedNav, setRequestedNav] = useState(null);

  const handleNavClick = (tab) => {
    if (location.pathname !== '/') {
      navigate('/');
    }
    setRequestedNav({ tab, timestamp: Date.now() });
  };

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} onNavClick={handleNavClick} />
      <main>
        <Routes>
          <Route
            path="*"
            element={
              <Home
                activeTab={activeTab}
                onActiveTabChange={setActiveTab}
                requestedNav={requestedNav}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}
