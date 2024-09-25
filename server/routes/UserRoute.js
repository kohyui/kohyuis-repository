import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';
import Verification from '../models/Verification.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';

dotenv.config();

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to generate a 6-digit verification code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const verifyToken = (req, res, next) => {
    console.log('Received headers:', req.headers); // Log received headers for debugging
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({ error: 'No token provided.' });
    }

    const tokenParts = authHeader.split(' ');
    if (tokenParts[0] !== 'Bearer' || !tokenParts[1]) {
        return res.status(403).json({ error: 'Invalid token format.' });
    }

    jwt.verify(tokenParts[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to authenticate token.' });
        }
        req.user = decoded; // Store the decoded token payload in req.user
        next();
    });
};

router.post('/update-seller-info', verifyToken, async (req, res) => {
    console.log('Received update request for seller info:', req.body);  // Debugging log

    const {
      fullName,
      displayName,
      profilePicture,
      description,
      personalWebsite,
      instagram,
      socialMedia,
      certifications,
      languages,
      skills
    } = req.body;

    try {
      // Validate required fields for becoming a seller
      if (!fullName || !displayName) {
        return res.status(400).json({ error: 'Full Name and Display Name are required for becoming a seller.' });
      }

      // Find the user by ID from the decoded token
      const user = await UserModel.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Update the user fields to become a seller
      user.fullName = fullName || user.fullName;
      user.displayName = displayName || user.displayName;
      user.profilePicture = profilePicture || user.profilePicture;
      user.description = description || user.description;
      user.personalWebsite = personalWebsite || user.personalWebsite;
      user.instagram = instagram || user.instagram;
      user.socialMedia = socialMedia || user.socialMedia;
      user.certifications = certifications || user.certifications;
      user.languages = languages || user.languages;
      user.skills = skills || user.skills;
      user.isSeller = true; // Set the user as a seller

      await user.save();

      res.status(200).json({ message: 'User successfully updated to seller.', user });
    } catch (error) {
      console.error('Update seller info error:', error.message);
      res.status(500).json({ error: 'Server error. Please try again later.', details: error.message });
    }
});

// Register route
router.post('/register', async (req, res) => {
    const { email, password, username, verificationCode, isSeller, fullName } = req.body;

    if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'Email is required and must be a valid string.' });
    }

    const normalizedEmail = email.toLowerCase();

    if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }

    if (!password || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    if (!username || username.length < 5 || username.length > 16) {
        return res.status(400).json({ error: 'Username must be between 5 and 16 characters.' });
    }

    if (!verificationCode || typeof verificationCode !== 'string') {
        return res.status(400).json({ error: 'Invalid verification code.' });
    }

    try {
        const existingEmail = await UserModel.findOne({ email: normalizedEmail });
        if (existingEmail) {
            return res.status(400).json({ error: 'Email is already taken.' });
        }

        const existingUsername = await UserModel.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ error: 'Username is already taken.' });
        }

        const verification = await Verification.findOne({ email: normalizedEmail, verificationCode });
        if (!verification) {
            return res.status(400).json({ error: 'Invalid verification code.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({ 
            email: normalizedEmail, 
            password: hashedPassword, 
            username,
            isSeller,
            fullName: fullName || '' // Ensure fullName is saved
        });
        await user.save();

        await Verification.deleteOne({ email: normalizedEmail });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ 
            message: 'Verification successful and user registered.', 
            user: { email: user.email, username: user.username, isSeller: user.isSeller, fullName: user.fullName }, 
            token 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

// Check email availability route
router.post('/check-email', async (req, res) => {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'Email is required and must be a valid string.' });
    }

    const normalizedEmail = email.toLowerCase();

    try {
        const user = await UserModel.findOne({ email: normalizedEmail });
        res.status(200).json({ exists: !!user });
    } catch (error) {
        console.error('Check email error:', error);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

// Check username availability route
router.post('/check-username', async (req, res) => {
    const { username } = req.body;

    if (!username || typeof username !== 'string') {
        return res.status(400).json({ error: 'Username is required and must be a valid string.' });
    }

    try {
        const user = await UserModel.findOne({ username });
        res.status(200).json({ exists: !!user });
    } catch (error) {
        console.error('Check username error:', error);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

// Send verification code route
router.post('/send-verification-code', async (req, res) => {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'Email is required and must be a valid string.' });
    }

    const normalizedEmail = email.toLowerCase();

    try {
        const verificationCode = generateVerificationCode();
        await Verification.updateOne({ email: normalizedEmail }, { verificationCode }, { upsert: true });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: normalizedEmail,
            subject: 'Your Verification Code',
            text: `Dear User,

Thank you for registering with our service! Your verification code is ${verificationCode}.

Please enter this code in the app to verify your account.

Best regards,
The Team`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Send verification code error:', error);
                return res.status(500).json({ error: 'Failed to send verification code. Please try again later.' });
            }
            res.status(200).json({ message: 'Verification code sent successfully.' });
        });
    } catch (error) {
        console.error('Send verification code error:', error);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

// Verify code route
router.post('/verify-code', async (req, res) => {
    const { email, verificationCode } = req.body;

    if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'Email is required and must be a valid string.' });
    }

    if (!verificationCode || typeof verificationCode !== 'string') {
        return res.status(400).json({ error: 'Verification code is required and must be a valid string.' });
    }

    const normalizedEmail = email.toLowerCase();

    try {
        const verification = await Verification.findOne({ email: normalizedEmail, verificationCode });
        if (!verification) {
            return res.status(400).json({ error: 'Invalid verification code.' });
        }

        res.status(200).json({ message: 'Verification code is valid.' });
    } catch (error) {
        console.error('Verify code error:', error);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'Email is required and must be a valid string.' });
    }

    if (!password || typeof password !== 'string') {
        return res.status(400).json({ error: 'Password is required and must be a valid string.' });
    }

    const normalizedEmail = email.toLowerCase();

    try {
        const user = await UserModel.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        // Check if the user is a Google user
        if (user.googleUser) {
            return res.status(400).json({ error: 'This user uses Google Sign-In. Please log in using Google.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ 
            token, 
            user: { email: user.email, username: user.username, isSeller: user.isSeller } 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

// Google Login Route
router.post('/google-login', async (req, res) => {
    const { tokenId } = req.body;

    try {
        // Verify the token with Google
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub, email } = payload; // `sub` is the unique Google user ID

        // Check if the user already exists
        let user = await UserModel.findOne({ email });
        if (user) {
            // User exists, return their data
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({ 
                token, 
                user: { email: user.email, username: user.username, isSeller: user.isSeller }, 
                isNewUser: false 
            });
        }

        // User does not exist, return signal to create username
        return res.status(200).json({ email, isNewUser: true });
    } catch (error) {
        console.error('Google Sign-In Error:', error);
        res.status(500).json({ error: 'Google Sign-In failed. Please try again later.' });
    }
});

// Google Sign-Up Completion Route
router.post('/google-complete', async (req, res) => {
    const { tokenId, username, email, isSeller } = req.body;

    try {
        // Verify the token again with Google to be safe
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub } = payload; // `sub` is the unique Google user ID

        // Ensure the username is not taken
        const existingUsername = await UserModel.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ error: 'Username is already taken.' });
        }

        // Create the new user
        const user = new UserModel({
            email,
            username,
            googleUser: true,
            isSeller, // New field for Google users
            password: await bcrypt.hash(sub, 10) // Store a hash of the Google user ID as the password
        });
        await user.save();

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ 
            token, 
            user: { email: user.email, username: user.username, isSeller: user.isSeller } 
        });
    } catch (error) {
        console.error('Google Sign-Up Completion Error:', error);
        res.status(500).json({ error: 'Google Sign-Up failed. Please try again later.' });
    }
});

// Fetch logged-in user's profile route
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error('Fetch user error:', error);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

// Update username route
router.post('/update-username', verifyToken, async (req, res) => {
    const { username } = req.body;

    if (!username || typeof username !== 'string') {
        return res.status(400).json({ error: 'Username is required and must be a valid string.' });
    }

    if (username.length < 5 || username.length > 16) {
        return res.status(400).json({ error: 'Username must be between 5 and 16 characters.' });
    }

    try {
        const existingUsername = await UserModel.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ error: 'Username is already taken.' });
        }

        const user = await UserModel.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        user.username = username;
        await user.save();

        res.status(200).json({ message: 'Username updated successfully.', user });
    } catch (error) {
        console.error('Update username error:', error);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

router.post('/update-profile-picture', verifyToken, async (req, res) => {
    const { profilePicture } = req.body;

    try {
        const user = await UserModel.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        user.profilePicture = profilePicture;
        await user.save();

        res.status(200).json({ message: 'Profile picture updated successfully.', user });
    } catch (error) {
        console.error('Update profile picture error:', error.message);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

// Route to get all users
router.get('/users', async (req, res) => {
    try {
        const users = await UserModel.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error('Fetch users error:', error);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

export default router;
