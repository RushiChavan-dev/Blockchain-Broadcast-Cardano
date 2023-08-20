// routes/orderRoute.js

import { Router } from 'express';
import Order from '../models/orderModel.js';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;



const router = Router();

// Handle GET request to retrieve all orders
router.route('/').get((req, res) => {
    Order.find()
    .populate('items.productId')  // Optionally populate product details in items
    .then(orders => res.json(orders))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/purchased-details').get(async (req, res) => {
    try {
        const userId = req.query.userId;

        // Check if userId is provided and is a valid ObjectId format
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({ error: "Valid User ID is required." });
        }

        // const result = await Order.aggregate([
        //     { $match: { userId: mongoose.Types.ObjectId(userId) } }
        // ]);

        const result = await Order.aggregate([
            { $match: { userId: mongoose.Types.ObjectId(userId) } },  // Filter by user
            { $unwind: '$items' },  // Break down items array
            {
                $lookup: {
                    from: 'books',  // Assuming your Book collection is named 'books'
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'bookDetails'
                }
            },
            { $unwind: '$bookDetails' },  // Break down bookDetails array
            {
                $project: {
                    purchaseDate: '$date',
                    title: '$bookDetails.title',
                    imageUrl: '$bookDetails.cover',
                    authorName: '$bookDetails.authorName',
                    chapters: '$bookDetails.chapters'
                }
            }
        ]);

        res.send(result);

    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Handle POST request to add a new order
router.route('/add').post((req, res) => {
    const { date, items, totalPrice, userId } = req.body;

    const newOrder = new Order({
        date,
        items,
        totalPrice,
        userId
    });

    newOrder.save()
    .then(order => res.json({ message: 'Order added!', orderId: order._id }))
    .catch(err => res.status(400).json('Error: ' + err));
});


export default router;
