import mongoose from 'mongoose';

export const shippingAddressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String

});

