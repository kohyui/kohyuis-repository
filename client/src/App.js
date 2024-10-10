import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { StyledEngineProvider } from '@mui/system';
import { AuthProvider, useAuth } from './components/AuthContext'; // Add useAuth here
import TopBar from './components/TopBar';
import Home from './pages/Home';
import Profile from './components/Profile';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import BecomeASeller from './pages/BecomeASeller';
import SellerRegistration from './components/SellerRegistration';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import AuthModal from './components/AuthModal';
import './styles/App.css';
import CreateGig from './components/CreateGig';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
console.log(GOOGLE_CLIENT_ID);

const AuthProviderWithNavigate = ({ children }) => {
  const navigate = useNavigate();
  return (
    <AuthProvider navigate={navigate}>
      {children}
    </AuthProvider>
  );
};

const App = () => {
  return (
    <StyledEngineProvider injectFirst>
      <Router>
        <AuthProviderWithNavigate>
          <div className="App">
            <TopBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<About />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/become-a-seller" element={<BecomeASeller />} />
              <Route path="/seller-registration" element={<SellerRegistration />} />
              <Route path="/create-gig" element={<CreateGig />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
            </Routes>
            <footer className="footer">
              <p style={{ fontSize: '12px' }}>©2024 by GigLah!</p>
              <p style={{ fontSize: '12px' }}>
                <Link to="/terms" style={{ marginRight: '10px' }}>Terms of Service</Link> |
                <Link to="/privacy-policy" style={{ marginLeft: '10px' }}>Privacy Policy</Link>
              </p>
            </footer>
            <AuthModalControl />
          </div>
        </AuthProviderWithNavigate>
      </Router>
    </StyledEngineProvider>
  );
};

function AuthModalControl() {
  const { modalOpen, closeAuthModal } = useAuth(); // useAuth is now defined

  return <AuthModal open={modalOpen} onClose={closeAuthModal} />;
}

export default App;
