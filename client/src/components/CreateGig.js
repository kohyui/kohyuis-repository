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
    country: 'Singapore', // Store country name initially
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

  // Handle country change to select the appropriate flag image
  const handleCountryChange = (e) => {
    setGigData({
      ...gigData,
      country: e.target.value, // Store the country name
    });
  };

  // Handle file change for multiple files
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5); // Limit to 5 files

    // Avoid adding duplicate files
    const newFiles = files.filter((file) => !selectedFiles.find((f) => f.name === file.name && f.size === file.size));
    setSelectedFiles([...selectedFiles, ...newFiles]); // Only add new unique files

    // Create preview URLs for the new selected files
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]); // Accumulate all previews
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

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

      // Map the country to the corresponding flag image path
      const countryImagePaths = {
        Singapore: '/flags/SingaporeFlag.png',
        Malaysia: '/flags/MalaysiaFlag.png',
        Indonesia: '/flags/IndonesiaFlag.png',
        Thailand: '/flags/ThailandFlag.png',
        Philippines: '/flags/PhilippinesFlag.png',
        Vietnam: '/flags/VietnamFlag.png',
      };

      // Prepare gig data with the image URLs and the corresponding flag image path
      const gigDetails = {
        ...gigData,
        portfolioImages: [...new Set(uploadedImageUrls)], // Ensure unique URLs
        countryImage: countryImagePaths[gigData.country], // Use the correct flag path
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
        setSelectedFiles([]); // Clear selected files after successful submission
        setPreviews([]); // Clear previews
        navigate('/');
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
          <label>Price per hour (S$)</label>
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
            onChange={handleCountryChange}
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
