import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email.']
    },
    verificationCode: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600 // expires in 1 hour
    }
}, { timestamps: true });

const Verification = mongoose.model('Verification', verificationSchema);

export default Verification;
