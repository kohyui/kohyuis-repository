import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './CreateGig.css'; // Import the CSS file for styling

const CreateGig = () => {
  const [gigData, setGigData] = useState({
    price: '',
    title: '',
    description: '',
    country: 'Singapore', // Default to Singapore
    portfolioImages: [], // Array to hold multiple image URLs
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]); // For image previews
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Ensure only sellers can access this page
  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.error('User is not authenticated.');
        navigate('/');
      } else if (!user.isSeller) {
        alert('Only sellers can create gigs!');
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

  // Handle file change for multiple files
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5); // Limit to 5 files
    setSelectedFiles([...selectedFiles, ...files]);

    // Create preview URLs for all selected files
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...previewUrls]); // Accumulate all previews
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('portfolioImages', file); // Append each file
    });

    try {
      // Upload multiple images to Cloudinary
      const uploadResponse = await axios.post('http://localhost:5001/gigs/upload-portfolio-images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedImageUrls = uploadResponse.data.urls;

      // Prepare gig data with the image URLs
      const gigDetails = {
        ...gigData,
        portfolioImages: uploadedImageUrls, // Add array of image URLs to gig data
        sellerUsername: user.username,
        sellerDisplayName: user.displayName,
        sellerProfilePicture: user.profilePicture,
        sellerInstagram: user.instagram,
        sellerWebsite: user.personalWebsite,
      };

      // Send gig data to the backend
      const response = await axios.post('http://localhost:5001/gigs', gigDetails);
      if (response.status === 201) {
        alert('Gig created successfully!');
        navigate('/gigs');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to create gig. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="gig-container">
      <h2 className="gig-heading">Create a New Gig</h2>
      <form onSubmit={handleSubmit} className="gig-form">
        <div className="gig-form-group">
          <label>Price (S$)</label>
          <input 
            type="text" 
            name="price" 
            value={gigData.price} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="gig-form-group">
          <label>Title</label>
          <input 
            type="text" 
            name="title" 
            value={gigData.title} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="gig-form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={gigData.description}
            onChange={handleChange}
            className="description-field"
            rows="4"
            required
          />
        </div>

        <div className="gig-form-group">
          <label>Country</label>
          <select
            name="country"
            value={gigData.country}
            onChange={handleChange}
            className="select-field"
          >
            <option value="Singapore">Singapore</option>
            <option value="Malaysia">Malaysia</option>
            <option value="Indonesia">Indonesia</option>
            <option value="Thailand">Thailand</option>
            <option value="Philippines">Philippines</option>
            <option value="Vietnam">Vietnam</option>
          </select>
        </div>

        <div className="gig-form-group">
          <label>Portfolio Images (1-5)</label>
          <input type="file" onChange={handleFileChange} multiple accept="image/*" />
          <div className="image-preview-container">
            {previews.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Preview ${index}`}
                className="image-preview"
              />
            ))}
          </div>
        </div>

        <button type="submit">Create Gig</button>
      </form>
    </div>
  );
};

export default CreateGig;
