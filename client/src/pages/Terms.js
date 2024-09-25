import React from 'react';
import Layout from '../components/Layout'; // Adjust the import path as necessary
import { Container } from '@mui/system'; // Correctly using Container here

function Terms() {
  return (
    <Layout>
      <Container maxWidth="lg" style={{ textAlign: 'left' }}> {/* Added textAlign style here */}
        <h1>Terms of Service</h1> {/* Updated to the correct heading */}
        <p>Welcome to GigLah!, a platform operated by Siloam Technologies Pte. Ltd. that connects freelance service providers with clients. By using our website www.giglah.com, you agree to comply with and be bound by the following terms and conditions of use.</p>
        <p><strong>Use of the Site:</strong> The Site provides a venue for users to interact. We do not screen or validate any content posted by users, nor do we involve ourselves in the actual transactions between buyers and sellers.</p>
        <p><strong>User Accounts:</strong> As a user of this Site, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password.</p>
        <p><strong>Content:</strong> Users may post content as long as it is not obscene, illegal, defamatory, or infringes on intellectual property rights. Content posted by users does not necessarily reflect the views of GigLah! or Siloam Technologies Pte. Ltd.</p>
        <p><strong>Termination:</strong> We may terminate your access to the Site, without cause or notice, which may result in the forfeiture and destruction of all information associated with your account.</p>
        <p><strong>Governing Law:</strong> Any disputes arising out of or related to the terms shall be governed by and construed in accordance with the laws of Singapore.</p>
        <p><strong>Changes to Terms:</strong> We reserve the right to modify these terms at any time. Your decision to continue to visit and make use of the Site after such changes have been made constitutes your formal acceptance of the new Terms of Service.</p>
        <p><strong>Contact Us:</strong> If you have any questions about these Terms of Service, please contact us at:
          <ul>
            <li>Email: support@giglah.com</li>
            <li>Address: Siloam Technologies Pte. Ltd., 111 North Bridge Road, #04-62 Peninsula Plaza, Singapore 179098</li>
          </ul>
        </p>
      </Container>
    </Layout>
  );
}

export default Terms;
