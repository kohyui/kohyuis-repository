import mongoose from 'mongoose';

const gigSchema = new mongoose.Schema({
  price: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  sellerUsername: {
    type: String,
    ref: 'User',  // Reference to the User model by username
    required: true
  },
  sellerDisplayName: {
    type: String,
    required: true
  },
  sellerProfilePicture: {  
    type: String,
    required: true
  },
  sellerInstagram: {
    type: String
  },
  sellerWebsite: {
    type: String
  },
  portfolioImages: {  
    type: [String],
    required: true
  },
  countryImage: {  
    type: String,
    required: true
  }
}, {
  collection: 'gig'
});

const GigModel = mongoose.model('Gig', gigSchema);

export default GigModel;
