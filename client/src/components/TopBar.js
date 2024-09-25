import React, { useState } from 'react';
import { AppBar, Toolbar, Button, TextField, InputAdornment, Box, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Logo from '../images/Logo_Words.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import AuthModal from './AuthModal';

function TopBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logOut, openAuthModal, modalOpen } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
      console.log('Search submitted:', searchTerm); // Log search term
    }
  };

  const handleAuthModalOpen = (view, intendedRoute) => {
    console.log('Auth modal opened:', view); // Log modal view
    openAuthModal(view, intendedRoute);
  };

  const handleLogout = () => {
    logOut();
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none', padding: 0 }}>
      <Toolbar disableGutters sx={{
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: '64px',
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <img src={Logo} alt="Giglah Logo" style={{ height: '150px', width: '200px', cursor: 'pointer' }} />
        </Link>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start', pl: 2 }}>
          <Button component={Link} to="/about" sx={{ color: 'black', textTransform: 'none', fontFamily: "'Roboto', sans-serif", height: '36px', fontSize: '0.875rem', ml: 2 }}>About</Button>
          <Button component={Link} to="/how-it-works" sx={{ color: 'black', textTransform: 'none', fontFamily: "'Roboto', sans-serif", height: '36px', fontSize: '0.875rem' }}>How it Works</Button>
          {user?.isSeller && (
            <Button component={Link} to="/create-gig" sx={{ color: 'black', textTransform: 'none', fontFamily: "'Roboto', sans-serif", height: '36px', fontSize: '0.875rem' }}>Create Gig</Button>
          )}
          <Button component={Link} to="/become-a-seller" sx={{ color: 'black', textTransform: 'none', fontFamily: "'Roboto', sans-serif", height: '36px', fontSize: '0.875rem' }}>Become a Seller</Button>
        </Box>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              variant="outlined"
              placeholder="Search for freelancers or gigs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                width: '290px',
                '& .MuiOutlinedInput-root': {
                  height: '36px',
                  '& fieldset': {
                    borderRadius: '4px',
                  },
                  '& input': {
                    fontSize: '0.875rem',
                  },
                  '&:hover fieldset': {
                    borderColor: '#7851A9',
                  },
                },
                '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                  borderColor: '#7851A9',
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="button" sx={{ padding: 0 }} onClick={handleSubmit}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </form>
        </Box>
        <Box>
          {/* <AuthModal open={modalOpen} onClose={() => handleAuthModalOpen('welcome')} /> */}
          {user ? (
            <>
              <IconButton onClick={() => navigate('/profile')} sx={{ color: 'black' }}>
                <AccountCircle />
              </IconButton>
              <Button 
                sx={{ color: 'black', textTransform: 'none', fontFamily: "'Roboto', sans-serif", height: '36px', fontSize: '0.875rem', mx: '10px' }} 
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button 
                sx={{ color: 'black', textTransform: 'none', fontFamily: "'Roboto', sans-serif", height: '36px', fontSize: '0.875rem', mx: '10px' }} 
                onClick={() => handleAuthModalOpen('logIn', '/profile')} // Open modal in 'logIn' view
              >
                Log in
              </Button>
              <Button 
                sx={{ backgroundColor: '#7851A9', color: 'white', textTransform: 'none', fontFamily: "'Roboto', sans-serif", height: '36px', fontSize: '0.875rem', borderRadius: '20px', px: 3, '&:hover': { backgroundColor: '#6a3d9a' } }} 
                onClick={() => handleAuthModalOpen('signUp', '/profile')} // Open modal in 'signUp' view
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
