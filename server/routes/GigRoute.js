import express from 'express';
import { v2 as cloudinaryV2 } from 'cloudinary';
import formidable from 'formidable';
import dotenv from 'dotenv';
import GigModel from '../models/GigModel.js';

dotenv.config(); // Load environment variables from .env file

const router = express.Router();

// Configure Cloudinary using environment variables
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ---------- ROUTES ----------

// 1. Get all gigs
router.get('/', async (req, res) => {
  try {
    const gigs = await GigModel.find(); // Retrieve all gigs from MongoDB
    res.json(gigs); // Return the gigs as JSON
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch gigs. Please try again later.' });
  }
});

// 2. Add a new gig with multiple portfolio images upload
router.post('/', async (req, res) => {
  const { price, title, description, sellerUsername, sellerDisplayName, sellerProfilePicture, sellerInstagram, sellerWebsite, portfolioImages } = req.body;

  // Validate the incoming gig data
  if (!price || !title || !description || !sellerUsername || !sellerDisplayName || !sellerProfilePicture || !portfolioImages || !Array.isArray(portfolioImages) || portfolioImages.length === 0) {
    return res.status(400).json({ message: 'Missing required fields or portfolio images are not formatted correctly' });
  }

  try {
    // Create a new gig
    const gig = new GigModel({
      price,
      title,
      description,
      sellerUsername,
      sellerDisplayName,
      sellerProfilePicture,
      sellerInstagram,
      sellerWebsite,
      portfolioImages, // Add the array of image URLs to the gig data
    });

    const newGig = await gig.save(); // Save the new gig to MongoDB
    res.status(201).json(newGig); // Return the new gig as JSON
  } catch (error) {
    res.status(400).json({ message: 'Failed to create gig. Please check your input and try again.' });
  }
});

// 3. Upload portfolio image (directly to Cloudinary)
router.post('/upload-portfolio-images', (req, res) => {
  const form = formidable({ multiples: true }); // Allow multiple files

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Form parsing error', error: err.message });
    }

    const uploadedUrls = [];

    try {
      // If there's only one file, handle it as an array for consistency
      const imageFiles = Array.isArray(files.portfolioImages) ? files.portfolioImages : [files.portfolioImages];

      // Upload each file to Cloudinary
      for (const file of imageFiles) {
        const result = await cloudinaryV2.uploader.upload(file.filepath, {
          folder: 'portfolio_images',
        });
        uploadedUrls.push(result.secure_url); // Add the uploaded URL to the array
      }

      res.status(200).json({ urls: uploadedUrls });
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      res.status(500).json({ message: 'Failed to upload images', error: error.message });
    }
  });
});

export default router;
