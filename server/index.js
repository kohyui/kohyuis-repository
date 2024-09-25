import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import morgan from 'morgan'; // Import morgan for logging requests
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import gigRoutes from './routes/GigRoute.js';
import userRoutes from './routes/UserRoute.js';
import jwt from 'jsonwebtoken';

// Set up environment variables
dotenv.config();

// Create an Express application
const app = express();
const PORT = process.env.PORT || 5001;

// Construct __dirname and __filename using ES Module syntax
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev')); // Use morgan for logging requests

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  // Start the server
  app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
})
.catch((error) => console.log('MongoDB connection error:', error.message));

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
      return res.status(403).send({ error: 'No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
          return res.status(500).send({ error: 'Failed to authenticate token.' });
      }
      req.userId = decoded.userId;
      next();
  });
};

// API Routes
app.use('/gigs', gigRoutes);
app.use('/users', userRoutes);

// Example protected route
app.get('/protected-route', verifyToken, (req, res) => {
    res.status(200).send({ message: 'This is a protected route' });
});

// "Catchall" handler to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;
