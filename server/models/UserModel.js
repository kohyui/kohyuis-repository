import mongoose from 'mongoose';

const userModel = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email.']
    },
    password: {
        type: String,
        required: function() {
            return !this.googleUser; // Password is required if not a Google user
        }
    },
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 16,
        unique: true
    },
    googleUser: {
        type: Boolean,
        default: false // Default is false, set to true if user registered via Google
    },
    isSeller: {
        type: Boolean,
        default: false // Default is false, set to true if user is registered as a seller
    },
    fullName: {
        type: String,
        required: function() {
            return this.isSeller; // Full Name is required if the user is a seller
        },
        trim: true
    },
    displayName: {
        type: String,
        required: function() {
            return this.isSeller; // Display Name is required if the user is a seller
        }
    },
    profilePicture: {
        type: String
    },
    description: {
        type: String
    },
    personalWebsite: {
        type: String,
        match: [/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'Invalid URL']
    },
    instagram: {
        type: String,
        match: [/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'Invalid URL']
    },
    socialMedia: {
        type: String,
        match: [/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'Invalid URL']
    },   
    certifications: [{
        certificate: String,
        certifiedFrom: String,
        year: Number
    }],
    languages: [{
        language: String,
        level: String
    }],
    skills: [String],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userModel);

export default User;
