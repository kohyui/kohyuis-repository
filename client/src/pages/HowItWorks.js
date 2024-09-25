import React from 'react';
import Layout from '../components/Layout';
import { Container, Box } from '@mui/system'; // Adjust import statements as necessary

function HowItWorks() {
  return (
    <Layout>
      <Container maxWidth="lg"> {/* Adjust maxWidth as necessary */}
        <Box sx={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
          <h1>How It Works</h1> {/* Use regular HTML tags for headings */}
          <p>Our platform is designed to be as straightforward and efficient as possible:</p> {/* Use regular HTML tags for paragraphs */}
          <ul style={{ textAlign: 'left', padding: 0 }}> {/* Use regular HTML tags for lists */}
            <li>Browse through our curated list of talented photographers.</li>
            <li>Find a photographer that meets your project's needs and preferences.</li>
            <li>Contact the seller directly through the information provided on their page.</li>
            <li>Discuss your project, negotiate terms, and get your project underway!</li>
          </ul>
          <p>It's free for both sellers to publish their services and buyers to contact them. We do not take any commission, ensuring the best deal for both parties.</p> {/* Use regular HTML tags for paragraphs */}
        </Box>
      </Container>
    </Layout>
  );
}

export default HowItWorks;
