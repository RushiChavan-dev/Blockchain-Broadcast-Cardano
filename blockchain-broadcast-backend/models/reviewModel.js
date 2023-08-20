import mongoose from 'mongoose';

export const reviewSchema = new mongoose.Schema({
    commenter: {
        type: String,
        default: "anonymous"
    },
    title: {
        type: String
    },
    content: {
        type: String
    },
    rating: {
        type: Number,
        max: 5,
        min: 1,
        default: 1
    }
});
