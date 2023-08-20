import mongoose from 'mongoose';

export const creditCardSchema = new mongoose.Schema({

    cardCVC: String,
    cardExpMonth: String,
    cardExpYear: String,
    cardHolder: String,
    cardNumber: String
});