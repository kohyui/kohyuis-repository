// Home.js (or any other component)
import React, { useState, useEffect } from 'react';
import { Container, Box } from '@mui/system';
import { useAuth } from '../components/AuthContext';
import GigCard from '../components/GigCard';
import Layout from '../components/Layout';
import TopBar  from '../components/TopBar'; // Import TopBar

function Home() {
    const { token } = useAuth();
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchGigs();
    }, []);

    const fetchGigs = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:5001/gigs', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setSearchResults(data);
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to fetch gigs:', error);
            setIsLoading(false);
        }
    };  

    const handleSearch = async (searchTerm) => {
        if (!searchTerm.trim()) {
            fetchGigs();
            return;
        }
        try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:5001/gigs/search?term=${encodeURIComponent(searchTerm)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setSearchResults(data);
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to search gigs:', error);
            setIsLoading(false);
        }
    };

    return (
      <Layout onSearch={handleSearch}>
        <Box>
            <Box style={{ width: '100%', marginTop: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
                <hr style={{ border: '1px solid grey' }} />
                <p style={{ marginBottom: '1rem', color: 'black' }}>
                    We find you the best. Experience top-tier photographers here.
                </p>
                <hr style={{ border: '1px solid grey' }} />
            </Box>
            <Container maxWidth="lg">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        searchResults.map((gig) => (
                            <div key={gig._id} style={{ width: '100%', maxWidth: 'calc(25% - 1rem)' }}>
                                <GigCard gig={gig} />
                            </div>
                        ))
                    )}
                </div>
            </Container>
        </Box>
      </Layout>
    );
}

export default Home;
