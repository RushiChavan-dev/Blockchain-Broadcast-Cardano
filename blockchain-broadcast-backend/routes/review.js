import json from 'body-parser';
import { Router } from 'express';
import { Book } from '../models/bookModel.js';
const router = Router();

//post a review for a specific book 
//probably gonna have to make this an update
//parameter instead of a post

router.route('/book/review/:id').post((req, res) => {
    Book.findById(req.params.id, 'books');

    const commenter = req.body.commenter;
    const title = req.body.title;
    const content = req.body.content;
    const rating = req.body.rating;

    const newReview = {
        "commenter": commenter,
        "title": title,
        "content": content,
        "rating": rating
    };
    newReview.save()
        .then(() => res.json('Review added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

export default router;
