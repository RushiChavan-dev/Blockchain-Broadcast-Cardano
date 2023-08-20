// models/orderModel.js

import mongoose from 'mongoose';
const Schema = mongoose.Schema;



const orderSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: Number
        }
    ],
    totalPrice: Number,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
