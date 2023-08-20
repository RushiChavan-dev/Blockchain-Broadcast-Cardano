import mongoose from 'mongoose';
import { creditCardSchema } from './creditCard.js';
import { shippingAddressSchema } from './ShippingAddress.js';
import { reviewSchema } from './reviewModel.js';
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    // TODO: Password must meet our current security standards
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true // wac
    },
    homeAddress: { // wac
        type: String,
        default: "",
        trim: true
    },
    nickname: { // wac
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    shippingAddress: [shippingAddressSchema],
    reviews: [reviewSchema],
    creditCards: [creditCardSchema],
    cart: {
        type: [Schema.Types.ObjectId],
        ref: 'Book',
        default: []
    },
    wishlist: {
        type: [Schema.Types.ObjectId],
        ref: 'Book',
        default: []
    },
    orders: {
        type: [[Schema.Types.ObjectId]],
        ref: 'Book',
        default: []
    },
});

export const user = mongoose.model('user', userSchema);
