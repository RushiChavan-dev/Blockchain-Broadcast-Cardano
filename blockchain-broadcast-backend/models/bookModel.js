import mongoose from 'mongoose';
import { reviewSchema } from './reviewModel.js';
const Schema = mongoose.Schema;

const bookSchema = new Schema({

    title: {
        type: String,
        maxlength: 50
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: 'Author',
    },

    authorName: {
        type: String,
        maxlength: 50
    },

    genre: {
        type: Schema.Types.ObjectId,
        ref: 'Genre'
    },

    sold: {
        type: Number,
        default: 0
    },

    comments: {
        type: [reviewSchema],
        default: []
    },

    price: {
        type: Number,
        default: 0
    },

    description: {
        type: String
    },

    cover: {
        type: String
    },

    releaseDate: {
        type: Date,
        required: true
    },

    publishingInfo: {
        publisher: {
            type: String
        },
        edition: {
            type: String
        },
        isbn: {
            type: String,
            unique: true,
            maxlength: 13,
            minlength: 13,
        }
    },

    rating: {
        type: Number,
        max: 5,
        min: 0,
        default: 0
    },

    numComments: {
        type: Number,
        default: 0,
        required: true
    },

});


bookSchema.index({
    title: 'text'
});

export const Book = mongoose.model('Book', bookSchema);
