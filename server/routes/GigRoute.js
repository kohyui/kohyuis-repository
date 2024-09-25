import express from 'express';
import { v2 as cloudinaryV2 } from 'cloudinary';
import formidable from 'formidable';
import GigModel from '../models/GigModel.js';

const router = express.Router();

// Configure Cloudinary (if you're using it)
cloudinaryV2.config({
  cloud_name: 'your-cloudinary-name',
  api_key: 'your-api-key',
  api_secret: 'your-api-secret'
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

// 2. Add a new gig with a single portfolio image upload
router.post('/', async (req, res) => {
  const { price, title, description, sellerUsername, sellerDisplayName, sellerProfilePicture, sellerInstagram, sellerWebsite, portfolioImage } = req.body;

  // Validate the incoming gig data
  if (!price || !title || !description || !sellerUsername || !sellerDisplayName || !sellerProfilePicture || !portfolioImage) {
    return res.status(400).json({ message: 'Missing required fields' });
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
      portfolioImage // Add the single image URL to the gig data
    });

    const newGig = await gig.save(); // Save the new gig to MongoDB
    res.status(201).json(newGig); // Return the new gig as JSON
  } catch (error) {
    res.status(400).json({ message: 'Failed to create gig. Please check your input and try again.' });
  }
});

// 3. Upload portfolio image (directly to Cloudinary)

router.post('/upload-portfolio-image', (req, res) => {
  const form = formidable();
  
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ messge: 'Form parsing error', error: err.message });
    }

    const file = files.portfolioImage;

    try {
      const result = await cloudinaryV2.uploader.upload(file.filepath, {
        folder: 'portfolio_images',
      });

      res.status(200).json({ url: result.secure_url });
    } catch (error) {
      res.status(500).json({ message: 'Failed to upload image', error: error.message });
    }
  });
});

export default router;
