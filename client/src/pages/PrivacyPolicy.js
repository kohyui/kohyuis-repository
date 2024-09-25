import React from 'react';
import Layout from '../components/Layout'; // Adjust the import path as necessary
import { Container } from '@mui/system'; // Correctly using Container here

function PrivacyPolicy() {
  return (
    <Layout>
      <Container maxWidth="lg" style={{ textAlign: 'left' }}> {/* Added textAlign style here */}
        <h1>Privacy Policy</h1>
        <p>Welcome to GigLah! operated by Siloam Technologies Pte. Ltd. ("we", "us", or "our"). We are committed to protecting the privacy of our users ("you"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website www.giglah.com (the "Site").</p>
        <p><strong>Information Collection:</strong> We collect information from you when you register on our Site, subscribe to our newsletter, respond to a survey, or fill out a form. The information collected includes your name, email address, phone number, and other details necessary to facilitate interactions on our Site.</p>
        <p><strong>Use of Information:</strong> The information we collect from you may be used in one of the following ways:
          <ul>
            <li>To personalize your experience</li>
            <li>To improve our website</li>
            <li>To improve customer service</li>
            <li>To send periodic emails</li>
          </ul>
        </p>
        <p><strong>Information Protection:</strong> We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information.</p>
        <p><strong>Third Party Links:</strong> Occasionally, at our discretion, we may include or offer third-party products or services on our Site. These third-party sites have separate and independent privacy policies. We therefore have no responsibility or liability for the content and activities of these linked sites.</p>
        <p><strong>Consent:</strong> By using our Site, you consent to our Privacy Policy.</p>
        <p><strong>Contacting Us:</strong> If there are any questions regarding this Privacy Policy, you may contact us using the information below:
          <ul>
            <li>Email: support@giglah.com</li>
            <li>Address: Siloam Technologies Pte. Ltd., 111 North Bridge Road, #04-62 Peninsula Plaza, Singapore 179098</li>
          </ul>
        </p>
      </Container>
    </Layout>
  );
}

export default PrivacyPolicy;
