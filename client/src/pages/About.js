// About.js
import React from 'react';
import Layout from '../components/Layout';
import { Container, Box } from '@mui/system';

function About() {
  const imageUrl = `https://res.cloudinary.com/djzawocta/image/upload/v1713435184/JL1_l9lmp0.jpg`;

  return (
    <Layout>
      <Container>
        <Box sx={{ textAlign: 'center' }}>
          <h1>About Us</h1>
          <img src={imageUrl} alt="Olympic Flag" style={{ width: '50%', height: 'auto', margin: '20px 0' }} />
          <p>Experience the best photographers on our page. We are a platform dedicated to connecting sellers and buyers in a seamless manner. Our mission is to become a one-stop platform for all your photography needs, eliminating the hassle of searching everywhere for the right photographer.</p>
          <p>Based in Singapore, we aim to expand our services to encompass other areas like developers, social media marketing, and more, if this experiment—or beta—proves successful. We're here to change the way business is done in Singapore and Southeast Asia, cutting down the costs of going through agencies and businesses to discover the many talented freelancers around.</p>
          <p>Contact us at <a href="mailto:support@giglah.co">support@giglah.co</a> for more information.</p>
        </Box>
      </Container>
    </Layout>
  );
}

export default About;
