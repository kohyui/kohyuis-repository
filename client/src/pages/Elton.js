import React from 'react';
import Layout from '../components/Layout'; // Adjust the import path as necessary
import { Container, Card, CardContent } from '@mui/material'; // Remove Typography import

function Elton() {
    return (
        <Layout>
            <hr style={{marginBottom: '20px'}}></hr>
            <Container maxWidth="x1" style={{ width: '100%', marginLeft: '50px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                {/* Profile Details Section */}
                <div style={{marginLeft: '200px'}}>
                    <Card style={{margin: '30px' , width: '400px', border: '1px solid #ccc' }}>
                        <CardContent style={{ textAlign: 'center' }}>
                            <h2>Profile Details</h2>
                            <img src="https://via.placeholder.com/200" alt="alternate" style={{ borderRadius: '50%' }} />
                            <p><strong>Name:</strong> John Doe</p>
                            <p><strong>Social Links:</strong></p>
                            <p>Phone Number: 12337890</p>
                            <p>Instagram: john_doe_insta</p>
                            <p><strong>Languages:</strong> English, Spanish</p>
                        </CardContent>
                    </Card>
                </div>
                <div style={{marginTop: '30px'}}>
                    {/* Reviews Card */}
                    <Card style={{ width: '850px', marginRight: '300px', marginBottom: '70px', display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '1px solid #ccc' }}>
                        <CardContent style={{ textAlign: 'center' }}>
                            <h2>Reviews</h2>
                            <p>Placeholder for reviews component</p>
                            <Card style={{ display: 'flex', marginBottom: '50px', marginTop: '50px', flexDirection: 'column', justifyContent: 'center', border: '1px solid #ccc'}}>
                                <CardContent>
                                    <div style={{ display: 'flex', marginLeft: '10px', flexDirection: 'row', alignItems: 'center'}}>
                                        <img src="https://via.placeholder.com/40" alt="alternate" style={{ borderRadius: '50%', maxHeight: '40px', maxWidth: '40px' }} />
                                        <p style={{marginLeft: '15px'}}><strong>User Name</strong></p>
                                    </div>
                                    <div style={{textAlign: 'left', marginLeft: '15px'}}>
                                        <p>Placeholder for reviews component</p>
                                        <p>[heart_icon] Number of Likes placeholder</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card style={{ display: 'flex', marginBottom: '50px', marginTop: '30px', flexDirection: 'column', justifyContent: 'center', border: '1px solid #ccc'}}>
                                <CardContent>
                                    <div style={{ display: 'flex', marginLeft: '10px', flexDirection: 'row', alignItems: 'center'}}>
                                        <img src="https://via.placeholder.com/40" alt="alternate" style={{ borderRadius: '50%', maxHeight: '40px', maxWidth: '40px' }} />
                                        <p style={{marginLeft: '15px'}}><strong>User Name</strong></p>
                                    </div>
                                    <div style={{textAlign: 'left', marginLeft: '15px'}}>
                                        <p>Placeholder for reviews component</p>
                                        <p>[heart_icon] Number of Likes placeholder</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>

                    {/* Deal Stats Card */}
                    <Card style={{ width: '850px', display: 'flex', marginBottom: '70px', flexDirection: 'column', justifyContent: 'center', border: '1px solid #ccc' }}>
                        <CardContent style={{ textAlign: 'center' }}>
                            <h2>Deal Stats</h2>
                            <p>Placeholder for deal stats component</p>
                            <Card style={{ display: 'flex', marginBottom: '50px', marginTop: '30px', flexDirection: 'column', justifyContent: 'center', border: '1px solid #ccc' }}>
                                <CardContent>
                                    <p>Placeholder for deal stats component</p>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>

                    {/* Saved Listings Card */}
                    <Card style={{ width: '850px', marginRight: '20px', marginBottom: '70px', display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '1px solid #ccc' }}>
                        <CardContent style={{ textAlign: 'center' }}>
                            <h2>Saved Listings</h2>
                            <p>Placeholder for saved listings component</p>
                            <Card style={{ display: 'flex', marginBottom: '50px', marginTop: '30px', flexDirection: 'column', justifyContent: 'center', border: '1px solid #ccc' }}>
                                <CardContent>
                                    <p>Placeholder for saved listings component</p>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                </div>
            </Container>
        </Layout>
      );
    }

export default Elton;