import React, { useEffect } from 'react';
import Layout from '../components/Layout'; // Adjust the import path as necessary
import { Container, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

function BecomeASeller() {
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();

  useEffect(() => {
    // Redirect to profile if user is already a seller
    if (user && user.isSeller) {
      navigate('/profile');
    }
  }, [user, navigate]);

  const handleNavigate = () => {
    if (user) {
      if (user.isSeller) {
        navigate('/profile'); // Redirect to profile page
      } else {
        navigate('/seller-registration'); // Navigate to the seller registration page
      }
    } else {
      openAuthModal('logIn', '/seller-registration'); // Opens login modal with intended route
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <h1>Become a Seller</h1>
        <p>
          Are you a talented freelancer in the fields of photography, development, or social media marketing? Looking for a platform to showcase your skills and connect with potential clients? Look no further!
        </p>
        <p>
          Join us at GigLah, where we provide you the space to publish your services for free and connect directly with buyers interested in your work. We're committed to creating opportunities for freelancers in Singapore and Southeast Asia, allowing you to grow your business without the hefty fees charged by agencies.
        </p>
        <p>
          To become a seller, simply register with us by providing your portfolio, services offered, and contact information. Let's revolutionize the freelance market together!
        </p>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            sx={{
              backgroundColor: '#7851A9',
              color: 'white',
              textTransform: 'none',
              fontFamily: "'Roboto', sans-serif",
              height: '36px',
              fontSize: '0.875rem',
              borderRadius: '20px',
              px: 3,
              '&:hover': { backgroundColor: '#6a3d9a' },
            }}
            onClick={handleNavigate}
          >
            {user && user.isSeller ? 'Go to Profile' : 'Register as a Seller'}
          </Button>
        </Box>
      </Container>
    </Layout>
  );
}

export default BecomeASeller;
