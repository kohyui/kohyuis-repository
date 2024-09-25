import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; 

const CreateGig = () => {
  const [gigData, setGigData] = useState({
    price: '',
    title: '',
    description: '',
    portfolioImage: '', // For image URL after upload
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null); // For image preview
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Ensure only sellers can access this page
  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.error("User is not authenticated.");
        navigate('/'); 
      } else if (!user.isSeller) {
        alert("Only sellers can create gigs!");
        navigate('/'); 
      }
    }
  }, [user, loading, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setGigData({
      ...gigData,
      [name]: value,
    });
  };

  // Handle file change and image preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file); // Store selected file

    // Create preview URL
    setPreview(URL.createObjectURL(file));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('portfolioImage', selectedFile); // Append selected file

    try {
      // Upload image to Cloudinary
      const uploadResponse = await axios.post('http://localhost:5001/gigs/upload-portfolio-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const uploadedImageUrl = uploadResponse.data.url;

      // Prepare gig data with the image URL
      const gigDetails = {
        ...gigData,
        portfolioImage: uploadedImageUrl, // Add image URL to gig data
        sellerUsername: user.username,  
        sellerDisplayName: user.displayName,
        sellerProfilePicture: user.profilePicture, 
        sellerInstagram: user.instagram, 
        sellerWebsite: user.personalWebsite 
      };

      // Send gig data to the backend
      const response = await axios.post('http://localhost:5001/gigs', gigDetails);
      if (response.status === 201) {
        alert("Gig created successfully!");
        navigate('/gigs');
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create gig. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Create a New Gig</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Price</label>
          <input 
            type="text" 
            name="price" 
            value={gigData.price} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Title</label>
          <input 
            type="text" 
            name="title" 
            value={gigData.title} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Description</label>
          <textarea 
            name="description" 
            value={gigData.description} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Portfolio Image</label>
          <input type="file" onChange={handleFileChange} />
          {preview && <img src={preview} alt="Preview" style={{ width: '100px', margin: '10px' }} />}
        </div>
        <button type="submit">Create Gig</button>
      </form>
    </div>
  );
};

export default CreateGig;
