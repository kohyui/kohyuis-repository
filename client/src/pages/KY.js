import React, { useState, useEffect } from 'react';
import {Card, CardContent, Typography, Tooltip, CardMedia, Box, Container } from '@mui/material'; // Correct import statement
import TopBar from '../components/TopBar';
import GigCard from '../components/GigCard';
import Layout from '../components/Layout';

function KY() {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGigs();
  }, []);

  // When testing on local computer, remove http://localhost:5001/gigs and just use '/gigs'

  const fetchGigs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5001/gigs'); // Make sure to use the correct URL and port
      const data = await response.json();
      setSearchResults(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch gigs:', error);
      setIsLoading(false);
    }
  };

    // When testing on local computer, remove http://localhost:5001/gigs/search and just use '/gigs/search....'
  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      fetchGigs();
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5001/gigs/search?term=${encodeURIComponent(searchTerm)}'); // Add this endpoint on your backend if not present
      const data = await response.json();
      setSearchResults(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to search gigs:', error);
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Box style={{ margin: '0', display: 'flex', justifyContent: 'flex-start' }}>
        <Card sx={{
          height: '100%', 
          width: '15%', // Adjust the width as needed
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff', // Background color
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Box shadow
          marginLeft: '0px', // Adjust the left margin to move the box slightly to the right
        }}>
          <CardContent sx={{ 
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly', // Change to 'space-evenly' to evenly space out the content
            alignItems: 'center', // Center the content horizontally
            fontSize: '1.2rem', // Increase the font size of the content
          }}>
            <div>
              <p>
                <img src="https://via.placeholder.com/150" alt="placeholder"></img>
              </p>
              <b>Name:</b>
              <Typography variant="h5" component="h2" gutterBottom>
                Elton
              </Typography>
              <b>Description:</b>
              <Typography variant="h5" gutterBottom>
                I specialise in weddings and being fat
              </Typography>
              <Typography variant="body2" gutterBottom>
                Rating: 4.7
              </Typography>
              <Typography variant="body2" gutterBottom>
                <img src="https://via.placeholder.com/150" alt="placeholder"></img>
              </Typography>
              <Typography variant="body2" gutterBottom>
                Languages:
              </Typography>
              <ul>
                <li>fat</li>
                <li>fatso</li>
                <li>fattest</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        <Container maxWidth="lg" style={{ textAlign: 'left' }}> {/* Align the container to the left */}
          <b alt="gigheading" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}> My Gigs:</b>
        </Container>
      </Box>
      <Container maxWidth="lg">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            searchResults.map((gig) => (
              <div key={gig.id} style={{ width: '100%', maxWidth: 'calc(25% - 1rem)' }}>
                <GigCard gig={gig} />
              </div>
            ))
          )}
        </div>
      </Container>
    </Layout>
  );
}

export default KY;